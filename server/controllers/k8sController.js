import * as k8s from "@kubernetes/client-node";

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

const k8sController = {};

k8sController.checkClickedPod = async (req, res, next) => {
  console.log(`🤖 Running checkClickedPod middleware...`);
  // const { podName } = req.body;
  // let { namespace } = req.body;

  try {
    let { podName, namespace, containers } = req.body;
    if (!podName || !namespace || !containers) {
      return next({
        log: "😰 Missing Pod name, Namespace or Container info",
        status: 400,
        message: "Please provide Pod name, Namespace and Container info",
      });
    }

    // If no namespace provided, namespace will be assign to 'default'
    if (!namespace) {
      namespace = "default";
      console.log(
        `Namespace is not provided. '${namespace}' namespace will be used.`,
      );
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
};

k8sController.softDeletePod = async (_req, res, next) => {
  console.log(`🤖 Running softDeletePod middleware...`);
  const { podName, namespace } = res.locals;

  try {
    await k8sCoreApiClient.deleteNamespacedPod(
      podName.trim(),
      namespace.trim(),
      undefined,
    );
    console.log(`Pod '${podName}' in '${namespace}' namespace is deleted.`);
    return next();
  } catch (err) {
    console.error("Full pod deletion error:", err);
    return next({
      log: `Error in softDeletePod: ${err.message}`,
      status: err.status || 500,
      message: {
        error: err.message || "Failed to delete pod",
        details: err.body?.message || err.response?.body?.message,
      },
    });
  }
};

k8sController.fetchPodLogs = async (_req, res, next) => {
  console.log(`🤖 Running fetchPodLogs middleware...`);
  const { podName, namespace } = res.locals;

  try {
    console.log("Fetching logs for", podName, namespace);

    const apiResponse = await k8sCoreApiClient.readNamespacedPodLog(
      podName.trim(),
      namespace.trim(),
      // containers[0],
    );
    // console.log("Logs fetched:", logs.body);
    res.locals.rawLogs = apiResponse.body;
    return next();
  } catch (err) {
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
};

k8sController.formatLogs = async (_req, res, next) => {
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
  const parsed = lines.map((line) => {
    try {
      const jsonObj = JSON.parse(line);
      const { ts, level, caller, msg } = jsonObj;
      return `${ts} [${(level || "").toUpperCase()}] ${caller} - ${msg}`;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      // console.error(`😭 An error occurred in formatLogs middleware: ${error}`); // too many console erros in terminal
      return line; // return raw line if JSON.parse fails
    }
  });
  res.locals.logs = parsed.join("\n");
  return next();
};

k8sController.getDeployment = async (_req, res, next) => {
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
      const name = obj.metadata.name;
      return podName.includes(name);
    });

    res.locals.deployment = deployment[0].metadata.name;
    return next();
  } catch (error) {
    return next({
      log: `😭 Error occurred in getDeployment middleware: ${error}`,
      status: 500,
      message: "Unable to retrieve deployment contain this pod.",
    });
  }
};

k8sController.readDeployment = async (_req, res, next) => {
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
};

k8sController.scaleReplicas = async (req, res, next) => {
  console.log("⚖️ Running scaleReplicas middleware...");
  const { body, namespace, deployment } = res.locals;
  const { newReplicas } = req.body;

  try {
    // Replace the current replicas with newReplicas
    body.spec.replicas = newReplicas;
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
    if (scaled.body.spec.replicas !== newReplicas) {
      return next({
        log: `Failed to updated replicas. Current replicas: ${scaled.body.spec.replicas}, Desired replicas: ${newReplicas}`,
        status: 500,
        message: "Unabled to update replicas. Please try again later.",
      });
    }

    // Save the updated replicas to res.locals to respond to frontend
    res.locals.updatedReplicas = scaled.body.spec.replicas;
    console.log(
      `Successfully updated replicas for '${scaled.body.metadata.name}' Deployment.`,
    );
    return next();
  } catch (error) {
    return next({
      log: `😨 Error occurred in scaleReplicas middleware: ${error}`,
      status: 500,
      message: "Unable to update your replicas due to an error",
    });
  }
};

k8sController.adjustRequestLimit = async (req, res, next) => {
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
      request: newRequests,
    };

    // Replace old resources with new resources
    container.resources = newResources;
    // console.log(body);
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
    const newContainer = scaled.body.spec.template.spec.containers[0];

    // If the new metrics are different, return to the error handler
    if (
      newContainer.resources.limits.cpu !== newLimits.cpu ||
      newContainer.resources.requests.cpu !== newRequests.cpu ||
      newContainer.resources.limits.memory !== newLimits.memory ||
      newContainer.resources.requests.memory !== newRequests.memory
    ) {
      return next({
        log: `🤯 Failed to updated Resources and Limits `,
        status: 400,
        message: "Unable to update your Resouces and Limits due to an error",
      });
    }

    res.locals.newLimits = newContainer.resources.limits;
    res.locals.newRequests = newContainer.resources.requests;
    console.log(
      `Successfully updated Resouces and Limits in '${newContainer.name}' Container.`,
    );
    return next();
  } catch (error) {
    return next({
      log: `🤯 Error occurred in adjustRequestLimit middleware: ${error}`,
      status: 500,
      message: "Unable to adjust your metrics...",
    });
  }
};

export default k8sController;
