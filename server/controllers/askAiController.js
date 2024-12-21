// askAiController.js - Controller for handling POST /askAi connecting to OpenAI API
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const openAiApiKey = process.env.OPENAI_API_KEY;
const openAiEndpoint = "https://api.openai.com/v1/chat/completions";

const askAiController = {};

askAiController.queryOpenAI = async (req, res, next) => {
  console.log("in queryOpenAI controller");
  const { allData } = req.body;
  const { userMessage } = req.body
  console.log(userMessage)
  // if (userMessage || allData || typeof allData !== "object") {
  //   return res
  //     .status(400)
  //     .json({ success: false, message: "Invalid request format" });
  // }
  try {
    //deconstruct prompt based on available data
    const {
      podsStatuses,
      requestLimits,
      allNodes,
      cpuUsageOneValue,
      memoryUsageOneValue,
      cpuUsageHistorical,
      memoryUsageHistorical,
      latencyAppRequestOneValue,
      latencyAppRequestHistorical,
    } = allData;

    //
    // 1. check to see if we are over or under provisioning
    // analyze historic request vs limit for cpu and memory
    // if request always falls very short of limit, decrease limit?
    // if request often surpasses limit, increase limit?
    // 2. Look for weird latency patterns
    // If there is a spike, could possibly be bottleneck?
    // cpuUsageHistorical, memoryUsageHistorical, latencyAppRequestHistorical,
    // Need: requestLimits

    //Detailed Prompt for OpenAi

    /*
        All Nodes: ${JSON.stringify(allNodes)}.
        CPU Usage (Current): ${JSON.stringify(cpuUsageOneValue)}.
        Memory Usage (Current): ${JSON.stringify(memoryUsageOneValue)}.
        Latency (Current): ${JSON.stringify(latencyAppRequestOneValue)}.
        Pods Statuses: ${JSON.stringify(podsStatuses)}.
        CPU Usage (Historical): ${JSON.stringify(cpuUsageHistorical)}.
        Latency (Historical): ${JSON.stringify(latencyAppRequestHistorical)}.`;
        Request Limits: ${JSON.stringify(requestLimits.usageAbsolute)}.

    */

    // const prompt = `You are a Kubernetes metrics analysis assistant.
    // You must analyze the following information and provide actionable insights:
    // Memory Usage (Historical): ${JSON.stringify(memoryUsageHistorical.usageAbsolute)}.

    // The user will give you this question: ${JSON.stringify(userMessage)}. Answer their question.

    // Limit your response to 100 words.
    // `;

    const prompt = `you are nice chatbot. you must chat with the user`
    
    const response = await axios.post(
      openAiEndpoint,
      {
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: prompt },
          {
            role: "user",
            content: `please chat with user. here is their input: ${JSON.stringify(userMessage)}`,
            // content: `Please provide an analysis of the following Kubernetes metrics: ${JSON.stringify(cpuUsageHistorical.usageAbsolute)}`,
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
    console.log("OPEN AI RESPONSE :", result);
    res.locals.analysis = result;
    next();

  } catch (error) {
    console.error(
      "Error communicating with OpenAI:",
      error.response?.data || error.message,
    );
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default askAiController;
