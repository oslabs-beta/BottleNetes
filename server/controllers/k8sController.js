import * as k8s from "@kubernetes/client-node";

const namespace = "default";
const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sCoreAPI = kc.makeApiClient(k8s.CoreV1Api);
const k8sAppsAPI = kc.makeApiClient(k8s.AppsV1Api);

const k8sController = {};

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

    const scaled = await k8sAppsAPI.readNamespacedDeployment(
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
