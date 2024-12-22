import * as k8s from "@kubernetes/client-node";

// const namespace = "default";

// object used to load Kubernetes configuration.
const kubeConfigObj = new k8s.KubeConfig();

// Load the default Kubernetes configuration
// This configuration is required to authenticate and communicate with the Kubernetes cluster.
kubeConfigObj.loadFromDefault();
kubeConfigObj.setCurrentContext("minikube");

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

  // async function getPods() {
  //   try {
  //     const podsListResponse = await k8sCoreApiClient.listPodForAllNamespaces();
  //     podsListResponse.items.forEach((pod) => {
  //       console.log(`${pod.metadata.namespace} - ${pod.metadata.name}`);
  //     });
  //   } catch (err) {
  //     console.error(`Error getting pods: ${err}`);
  //   }
  // }
  // await getPods();
  // console.log("after get pods");

  try {
    // First verify the pod exists
    // console.log("About to read pod:", podName, "in namespace:", namespace);
    // const podExists = await k8sCoreApiClient
    //   .readNamespacedPod(podName, namespace)
    //   .catch((err) => {
    //     console.error("Pod read error:", err.body || err);
    //     // throw new Error(`Pod ${podName} not found or not accessible`);
    //   });

    // console.log("Found pod:", podExists.body.metadata.name);

    // Delete the pod
    // console.log("About to delete:", {
    //   podName,
    //   namespace,
    //   typeOfPodName: typeof podName,
    // });
    await k8sCoreApiClient.deleteNamespacedPod(
      podName.trim(), // name
      namespace.trim(), // namespace
    );

    // console.log(`Pod ${podName} deletion command sent successfully`);
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
