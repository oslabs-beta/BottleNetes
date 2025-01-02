/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Controller contains:
 * checkClickedPod: Check if a pod is clicked and send data to the next middleware
 * softDeletePod: Restart a pod by deleting a clicked pod. Deployment will automatically create a new pod
 * fetchPodLogs: Get logs for clicked pod
 * formatLogs: Format fatched logs into a more readable format
 * getDeployment: Get deployment name for clicked pod
 * readDeployment: Get the info of the retrieved deployment
 * scaleReplicas: Replace old replicas with new amount of replicas for the retrieved deployment. Deployment will create new pods accordingly
 * adjustRequestsLimits: Change the resources quota for the retrieved deployment
 */

import * as k8s from "@kubernetes/client-node";
import { Request, Response, NextFunction } from "express";

// object used to load Kubernetes configuration.
const kubeConfigObj = new k8s.KubeConfig();

// Load the default Kubernetes configuration
// This configuration is required to authenticate and communicate with the Kubernetes cluster.
kubeConfigObj.loadFromDefault();
// kubeConfigObj.setCurrentContext("minikube");

// Create client instances from the loaded KubeConfig object
// The clients are used to interact with Kubernetes resources in the Core API group,
// such as Pods, Services, and ConfigMaps.
const k8sCoreApiClient = kubeConfigObj.makeApiClient(k8s.CoreV1Api);
const k8sAppsApiClient = kubeConfigObj.makeApiClient(k8s.AppsV1Api);

interface K8sController {
  checkClickedPod: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  softDeletePod: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  fetchPodLogs: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  formatLogs: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  getDeployment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  readDeployment: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  scaleReplicas: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  adjustRequestLimit: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

const k8sController: K8sController = {
  checkClickedPod: async (req, res, next) => {
    console.log(`🤖 Running checkClickedPod middleware...`);

    try {
      const { podName, namespace, containers } = req.body;

      if (!podName || !namespace || !containers) {
        return next({
          log: "😰 Missing Pod name, Namespace or Container info",
          status: 400,
          message: "Please provide Pod name, Namespace and Container info",
        });
      }

      res.locals.podName = podName;
      res.locals.namespace = namespace;
      res.locals.containers = containers;
      return next();
    } catch (error) {
      return next({
        log: `😭 Error occurred in checkClickedPod middleware: ${error}`,
        status: 500,
        message: "Unable to find your pod...",
      });
    }
  },

  softDeletePod: async (_req, res, next) => {
    console.log(`🤖 Running softDeletePod middleware...`);

    const { podName, namespace } = res.locals;

    const isPodDeleted = async (
      podName: string,
      namespace: string,
      k8sClient: k8s.CoreV1Api,
    ) => {
      try {
        const response = await k8sClient.readNamespacedPod(podName, namespace);
        console.log(
          `Pod status check - Name: ${podName}, Phase: ${response.body.status?.phase}`,
        );
        return false; // Pod still exists
      } catch (error: any) {
        if (error.response?.statusCode !== 200) {
          return true; // Pod is deleted
        }
        console.log("Error checking pod status:", error.message);
        throw error; // Unexpected error happened
      }
    };

    if (
      await isPodDeleted(podName.trim(), namespace.trim(), k8sCoreApiClient)
    ) {
      console.log(
        `✅ Pod '${podName}' in '${namespace}' namespace is confirmed deleted.`,
      );
      return next();
    }

    const MAX_RETRIES = 20;
    const RETRY_INTERVAL = 3000; // in ms
    const TIMEOUT = MAX_RETRIES * RETRY_INTERVAL;

    try {
      console.log(
        `🔥 Attempting to softly delete pod '${podName}' in namespace '${namespace}'`,
      );
      const deleteResponse = await k8sCoreApiClient.deleteNamespacedPod(
        podName.trim(),
        namespace.trim(),
        undefined,
      );
      console.log(
        "🧐 Soft deletion pod response status:",
        deleteResponse.response.statusCode,
      );

      // Initialize the timer for the retries
      const startTime = Date.now();
      let retries = 0;
      // Check if the pod is deleted every RETRY_INTERVAL
      while (retries < MAX_RETRIES) {
        if (
          await isPodDeleted(podName.trim(), namespace.trim(), k8sCoreApiClient)
        ) {
          console.log(
            `✅ Pod '${podName}' in '${namespace}' namespace is confirmed deleted.`,
          );
          return next();
        }

        if (Date.now() - startTime > TIMEOUT) {
          throw new Error("Pod deletion timeout exceeded");
        }

        await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
        retries++;
        console.log(
          `⏰ Waiting for pod deletion... (attempt ${retries}/${MAX_RETRIES})`,
        );
      }

      throw new Error("Pod deletion verification failed after maximum retries");
    } catch (err: any) {
      console.error("😨 Full pod deletion error:", err);
      return next({
        log: `😭 Error in softDeletePod: ${err.message}`,
        status: err.status || 500,
        message: {
          error: err.message || "Failed to delete pod",
          details: err.body?.message || err.response?.body?.message,
        },
      });
    }
  },

  fetchPodLogs: async (req, res, next) => {
    console.log(`🤖 Running fetchPodLogs middleware...`);
    const { podName, namespace } = res.locals;
    const { selectedContainer } = req.body;

    if (!selectedContainer) {
      return next({
        log: "Container name not provided",
        status: 400,
        message: "Please select a container to view logs",
      });
    }

    try {
      console.log(
        `😗 Fetching logs for container '${selectedContainer}' in pod '${podName}' (namespace: '${namespace}')...`,
      );

      const apiResponse = await k8sCoreApiClient.readNamespacedPodLog(
        podName.trim(),
        namespace.trim(),
        selectedContainer,
      );

      res.locals.rawLogs = apiResponse.body;
      return next();
    } catch (err: any) {
      console.error("Error fetching logs:", err);
      return next({
        log: `Error in fetchPodLogs: ${err.message}`,
        status: err.status || 500,
        message: {
          error: err.message || "Failed to fetch logs",
          details: err.body?.message || err.response?.body?.message,
        },
      });
    }
  },

  formatLogs: async (_req, res, next) => {
    // sample log json:
    // {
    //   "level": "warn",
    //   "ts": "2024-12-21T16:51:21.127720Z",
    //   "caller": "embed/config.go:687",
    //   "msg": "Running http and grpc server on single port. This is not recommended for production."
    // }
    console.log(`🤖 Running formatLogs middleware...`);
    const { rawLogs } = res.locals;
    const lines = rawLogs.split("\n");
    const parsed = lines.map((line: string) => {
      try {
        const jsonObj = JSON.parse(line);
        const { ts, level, caller, msg } = jsonObj;
        return `${ts} [${(level || "").toUpperCase()}] ${caller} - ${msg}`;
      } catch (error) {
        // console.error(`🤓 Format not supported. Returning raw logs... ${error}`);
        return line; // return raw line if JSON.parse fails
      }
    });
    res.locals.logs = parsed.join("\n");
    return next();
  },

  getDeployment: async (_req, res, next) => {
    console.log(`🤖 Running getDeployment middleware...`);
    const { podName, namespace } = res.locals;

    try {
      // List all Deployment in all Namespace
      const data = await k8sAppsApiClient.listNamespacedDeployment(namespace);

      if (!data) {
        return next({
          log: `No deployment in '${namespace}' namespace`,
          status: 400,
          message: "Unable to return any deployment from provided namespace.",
        });
      }
      // Extract deployment array
      const deployments = data.body.items;

      // Filter for the corressponding deployment
      const deployment = deployments.filter((obj) => {
        const name = obj.metadata?.name;
        return podName.includes(name);
      });

      res.locals.deployment = deployment[0].metadata?.name;
      return next();
    } catch (error) {
      return next({
        log: `😭 Error occurred in getDeployment middleware: ${error}`,
        status: 500,
        message: "Unable to retrieve deployment contain this pod.",
      });
    }
  },

  readDeployment: async (_req, res, next) => {
    console.log(`🤓 Running readDeployment middleware...`);
    const { deployment, namespace } = res.locals;

    try {
      // Read the deployment in the current namespace
      const scaled = await k8sAppsApiClient.readNamespacedDeployment(
        deployment,
        namespace,
      );

      res.locals.body = scaled.body;
      return next();
    } catch (error) {
      return next({
        log: `😭 Error occurred in scaleReplicas middleware: ${error}`,
        status: 500,
        message: "Unable to adjust your pod replicas...",
      });
    }
  },

  scaleReplicas: async (req, res, next) => {
    console.log("⚖️ Running scaleReplicas middleware...");
    const { body, namespace, deployment } = res.locals;
    const { newReplicas } = req.body;

    try {
      // Replace the current replicas with newReplicas
      /*
    Since stringify parsed everything into a string and replicas only takes a number,
    We need to parse newReplicas back to a number
    */
      body.spec.replicas = parseInt(newReplicas);
      // Replace the current deployment to the updated deployment
      await k8sAppsApiClient.replaceNamespacedDeployment(
        deployment,
        namespace,
        body,
      );

      // Read newDeployment to double-check the updated replicas
      const scaled = await k8sAppsApiClient.readNamespacedDeployment(
        deployment,
        namespace,
      );

      // If the replicas does not match with newReplicas, return to the error handler
      if (scaled.body.spec?.replicas !== newReplicas) {
        return next({
          log: `Failed to updated replicas. Current replicas: ${scaled.body.spec?.replicas}, Desired replicas: ${newReplicas}`,
          status: 500,
          message: "Unabled to update replicas. Please try again later.",
        });
      }

      // Save the updated replicas to res.locals to respond to frontend
      res.locals.updatedReplicas = scaled.body.spec?.replicas;
      console.log(
        `Successfully updated replicas for '${scaled.body.metadata?.name}' Deployment.`,
      );
      return next();
    } catch (error) {
      return next({
        log: `😨 Error occurred in scaleReplicas middleware: ${error}`,
        status: 500,
        message: "Unable to update your replicas due to an error",
      });
    }
  },

  adjustRequestLimit: async (req, res, next) => {
    console.log(`🪙 Running adjustRequestLimit middleware...`);
    const { body, deployment, namespace } = res.locals;
    const { newRequests, newLimits } = req.body;
    if (!newRequests || !newLimits) {
      return next({
        log: "🤯 New Metrics are not provided",
        status: 400,
        message: "Please provide new metrics for adjustments",
      });
    }

    try {
      // Drill to the container level
      const container = body.spec.template.spec.containers[0];
      // Define the new resources and limits metrics
      const newResources = {
        ...container.resources,
        limits: newLimits,
        requests: newRequests,
      };

      // Replace old resources with new resources
      container.resources = newResources;
      // Replace current deployment with the updated deployment
      await k8sAppsApiClient.replaceNamespacedDeployment(
        deployment,
        namespace,
        body,
      );

      // Read the newly updated deployment to make sure the resources are updated
      const scaled = await k8sAppsApiClient.readNamespacedDeployment(
        deployment,
        namespace,
      );

      // Drill to the container level again
      const newContainer = scaled.body.spec?.template.spec?.containers[0];
      // If the new metrics are different, return to the error handler
      if (
        newContainer?.resources?.limits?.cpu !== newLimits.cpu ||
        newContainer?.resources?.requests?.cpu !== newRequests.cpu ||
        newContainer?.resources?.limits?.memory !== newLimits.memory ||
        newContainer?.resources?.requests?.memory !== newRequests.memory
      ) {
        return next({
          log: `🤯 Failed to updated Resources and Limits `,
          status: 400,
          message: "Unable to update your Resouces and Limits due to an error",
        });
      }

      res.locals.newLimits = newContainer?.resources?.limits;
      res.locals.newRequests = newContainer?.resources?.requests;
      console.log(
        `Successfully updated Resouces and Limits in '${newContainer?.name}' Container.`,
      );
      return next();
    } catch (error) {
      return next({
        log: `🤯 Error occurred in adjustRequestLimit middleware: ${error}`,
        status: 500,
        message: "Unable to adjust your metrics...",
      });
    }
  },
};

export default k8sController;
