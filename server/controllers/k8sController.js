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
  try {
    const { podName, namespace } = req.body;
    if (!podName || !namespace) {
      return next({
        log: "😰 Missing Pod name and Namespace",
        status: 400,
        message: "Please provide Pod name and Namespace",
      });
    }
    res.locals.podName = podName;
    res.locals.namespace = namespace;
    return next();
  } catch (error) {
    return next({
      log: `😭 Error occurred in checkClickedPod middleware: ${error}`,
      status: 500,
      message: "Unable to find your pod...",
    });
  }
};

k8sController.softDeletePod = async (req, res, next) => {
  const { podName, namespace } = res.locals;

  try {
    await k8sCoreApiClient.deleteNamespacedPod(
      podName.trim(),
      namespace.trim(),
    );
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

k8sController.fetchPodLogs = async (req, res, next) => {
  const { podName, namespace } = res.locals;

  try {
    console.log("Fetching logs for", podName, namespace);

    const apiResponse = await k8sCoreApiClient.readNamespacedPodLog(
      podName.trim(),
      namespace.trim(),
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

k8sController.formatLogs = async (req, res, next) => {
  // sample log json:
  // {
  //   "level": "warn",
  //   "ts": "2024-12-21T16:51:21.127720Z",
  //   "caller": "embed/config.go:687",
  //   "msg": "Running http and grpc server on single port. This is not recommended for production."
  // }
  const { rawLogs } = res.locals;
  const lines = rawLogs.split("\n");
  const parsed = lines.map((line) => {
    try {
      const jsonObj = JSON.parse(line);
      const { ts, level, caller, msg } = jsonObj;
      return `${ts} [${(level || "").toUpperCase()}] ${caller} - ${msg}`;
    } catch (error) {
      console.error(`😭 An error occurred in formatLogs middleware: ${error}`);
      return line; // return raw line if JSON.parse fails
    }
  });
  res.locals.logs = parsed.join("\n");
  return next();
};

k8sController.scaleReplicas = async (req, res, next) => {
  console.log(`⚖ Running scaleReplicas middleware...`);
  const { deployment, newReplicas } = req.body;

  try {
    // See if there are any namespace in res.locals
    let { namespace } = res.locals;

    // If there are no namespace available, set namespace to 'default'
    if (!namespace) namespace = 'default';

    // If no deployment or replicas are provided, return to the error handler
    if (!deployment || !newReplicas) {
      return next({
        log: "😰 Missing Deployment name and number of Replicas",
        status: 400,
        message: "Please provide Deployment name and number of Replicas",
      });
    };

    // Read the deployment in the current namespace
    let scaled = await k8sAppsApiClient.readNamespacedDeployment(
      deployment,
      namespace,
    );
    const result = scaled.body;
    // Replace the current replicas with newReplicas
    result.spec.replicas = newReplicas;
    // Replace the current deployment to the updated deployment
    const newDeployment = await k8sAppsApiClient.replaceNamespacedDeployment(deployment, namespace, result);

    // Read newDeployment to double-check the updated replicas
    scaled = await k8sAppsApiClient.readNamespacedDeployment(newDeployment, namespace);
    
    // If the replicas does not match with newReplicas, return to the error handler
    if (scaled.body.spec.replicas !== newReplicas) {
      return next ({
        log: `Failed to updated replicas. Current replicas: ${scaled.body.spec.replicas}, Desired replicas: ${newReplicas}`,
        status: 500,
        message: 'Unabled to update replicas. Please try again later.'
      });
    };

    // Save the updated replicas to res.locals to respond to frontend
    res.locals.updatedReplicas = scaled.body.spec.replicas;
    return next();
  } catch (error) {
    return next({
      log: `😭 Error occurred in scaleReplicas middleware: ${error}`,
      status: 500,
      message: "Unable to adjust your pod replicas...",
    });
  }
};

k8sController.adjustRequestLimit = async (req, res, next) => {
  console.log(`🪙 Running adjustRequestLimit middleware...`);

try {

} catch (error) {
  return next({
    log: `Error occurred in adjustRequestLimit middleware: ${error}`,
    status: 500,
    message: 'Unable to adjust your metrics...'
  });
};
};

export default k8sController;
