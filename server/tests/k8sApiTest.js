import * as k8s from "@kubernetes/client-node";

const kc = new k8s.KubeConfig();
kc.loadFromDefault();
kc.setCurrentContext("minikube");

const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);

coreV1Api
  .deleteNamespacedPod(
    "ai-daffy-backend-deployment-85d8cbd6c7-s8dct",
    "default",
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    { gracePeriodSeconds: 0 },
    undefined, // _options
  )
  .then((res) => console.log("Deleted pod:", res.body))
  .catch((err) => console.error("Error deleting pod:", err));
