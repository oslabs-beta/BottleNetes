import * as k8s from "@kubernetes/client-node";

const namespace = "default";

// object used to load Kubernetes configuration.
const kubeConfigObj = new k8s.KubeConfig();

// Load the default Kubernetes configuration
// This configuration is required to authenticate and communicate with the Kubernetes cluster.
kubeConfigObj.loadFromDefault();

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
  const { podName, namespace } = req.body;
  try {
    await k8sCoreApiClient.deleteNamespacedPod(podName, namespace);
  } catch (err) {
    return next({
      log: `😭 Error occurred in softDeletePod middleware: ${err}`,
      status: 500,
      message: "Unable to restart your pod...",
    });
  }
};

k8sController.scaleReplicas = async (req, res, next) => {
  console.log(`⚖ Running scaleReplicas middleware...`);

  try {
    const { deploymentName, newReplicas } = req.body;
    if (!deploymentName || !newReplicas) {
      return next({
        log: "😰 Missing Deployment name and number of Replicas",
        status: 400,
        message: "Please provide Deployment name and number of Replicas",
      });
    }

    const scaled = await k8sAppsApiClient.readNamespacedDeployment(
      deploymentName,
      namespace,
    );
    const result = scaled.body;
    console.log(result);
    result.spec.replicas = newReplicas;
    res.locals.newReplicas = result.spec.replicas;
    return next();
  } catch (error) {
    return next({
      log: `😭 Error occurred in scaleReplicas middleware: ${error}`,
      status: 500,
      message: "Unable to adjust your pod replicas...",
    });
  }
};

// k8sController.adjustRequestLimit = async (req, res, next) => {
//   console.log(`🪙 Running adjustRequestLimit middleware...`);

// try {

// } catch (error) {
//   return next({
//     log: `Error occurred in adjustRequestLimit middleware: ${error}`,
//     status: 500,
//     message: 'Unable to adjust your metrics...'
//   });
// };
// };

export default k8sController;
