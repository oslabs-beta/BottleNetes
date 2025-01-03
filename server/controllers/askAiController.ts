// askAiController.js - Controller for handling POST /askAi connecting to OpenAI API
import axios from "axios";
import dotenv from "dotenv";
import process from "process";
import { Request, Response, NextFunction } from "express";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

const openAiApiKey = process.env.OPENAI_API_KEY || "";
const openAiEndpoint = "https://api.openai.com/v1/chat/completions" as const;

const askAiController = {
  queryOpenAI: async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    // console.log("in queryOpenAI controller");
    const { userMessage } = req.body;
    const {
      prunedCpuUsageHistorical,
      prunedLatencyAppRequestHistorical,
      prunedMemoryUsageHistorical,
      rawAllPodsStatus,
      rawAllPodsRequestLimit,
    } = req.body.data;

    // console.log(userMessage);
    // console.log("prunedCpuUsageHistorical", prunedCpuUsageHistorical);
    try {
      const role = `
        ----
        Role \n
        ----
        Your name is Bottlenetes.
        You are an AI chatbot and an expert in monitoring Kubernetes clusters and their components. \n
        Your role is to analyze real-time and historical Kubernetes data that will be provided to you.
        (e.g., pod statuses, CPU/memory usage, api request latency), detect anomalies, and provide actionable insights and recommendations. \n

        You run on other applications or environments using Kubernetes and help users identify the bottlenecks and optimize their cluster performance. \n
      `;

      const dataProvided = `
        ----
        Data Provided \n
        ----
        Here is the data from the user's Kubernetes cluster:
        prunedCpuUsageHistorical: ${JSON.stringify(prunedCpuUsageHistorical)},
        prunedLatencyAppRequestHistorical: ${JSON.stringify(prunedLatencyAppRequestHistorical)},
        prunedMemoryUsageHistorical: ${JSON.stringify(prunedMemoryUsageHistorical)},
        rawAllPodsStatus: ${JSON.stringify(rawAllPodsStatus)},
        rawAllPodsRequestLimit${JSON.stringify(rawAllPodsRequestLimit)}.

        prunedCpuUsageHistorical, prunedLatencyAppRequestHistorical, prunedMemoryUsageHistorical: \n
        These three datasets contain historical information for each individual pod in the cluster. Specifically:\n
        prunedCpuUsageHistorical: Historical CPU usage data.\n
        prunedLatencyAppRequestHistorical: Historical application api request latency data.\n
        prunedMemoryUsageHistorical: Historical memory usage data.\n

        Each of these datasets is an array of objects. Each object corresponds to a pod and contains the following:\n
        Pod Name: The name of the pod.\n
        Usage Data: Arrays of absolute and relative usage data, showing resource consumption over time.\n

        IMPORTANT: If the dataset contains more than four data points, they have been randomly selected from a larger set of historical data.\n

        rawAllPodsStatus:\n
        This dataset contains the status of all pods, represented as a single data point per pod. Each pod's status is identified by its name.\n

        rawAllPodsRequestLimit:\n
        This dataset provides the resource request limits (e.g., CPU, memory) for each pod. It is a single data point per pod, identified by its name.\n
      `;

      const generalInstruction = `
        ----
        General Instructions:\n
        ----
        Using this data, answer user queries by analyzing the provided Kubernetes data. \n
        You can use the historical resource usage (CPU, memory, api request latency) and the current status/request limits of the pods to formulate your answers. \n
        If the user asks about specific pods, provide the relevant information based on their name and the available data.\n

        When assisting users, provide clear, concise, and informative explanations,
        offering reasons and context for your answers. Maintain a friendly and helpful tone. \n
        Additionally, ask clarifying questions to gather context about the applications
        or environments you are monitoring and the specific goals or challenges the user faces. \n
        Tailor your recommendations to the unique use case of the operational goals of applications you are supporting. \n
      `;

      const formatGuidelines = `
        ----
        Format Guidelines:\n
        ----
        When sending back your analysis, make sure that is is well-formatted with line breaks and indentations.\n
        Make sure sections are clearly separated and labeled. Make your replies concise and to the point.\n
        Make sure to include statitics and numbers when relevant.\n
        You do not have to greet the user everytime you respond.\n

        For example: This is an acceptable format when asked about the data that you have access to:\n

        Currently, I have access to several types of data from your Kubernetes cluster:\n
        1. Historical Resource Usage Data:\n
          - CPU Usage: This includes historical CPU usage data for each individual pod.\n
          - Memory Usage: This includes historical memory usage data for each individual pod.\n
          - Application API Request Latency: This includes historical latency data for application API requests (both inbound and outbound, in ms).
        2. Current Pod Status: A single data point for the status of each pod in the cluster.\n
        3. Resource Request Limits: The current resource request limits (e.g., CPU, memory) set for each pod.\n
        Please let me know if there's anything specific you would like to analyze or if you have questions about optimizing your Kubernetes cluster.\n

        If the user asks about a specific pod, you can provide a detailed analysis based on the available data.\n
      `;

      const prompt =
        role + dataProvided + generalInstruction + formatGuidelines;

      const response = await axios.post(
        openAiEndpoint,
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: prompt },
            {
              role: "user",
              content: JSON.stringify(userMessage),
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${openAiApiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      const result = response.data.choices[0].message.content;
      // console.log("OPEN AI RESPONSE :", result);
      res.locals.analysis = result;
      next();
    } catch (error) {
      return next({
        log: `Error occurred in askAiController.queryOpenAI: ${error}`,
        status: 500,
        message: "An error occurred. Please try again.",
      });
    }
  },
};

export default askAiController;
