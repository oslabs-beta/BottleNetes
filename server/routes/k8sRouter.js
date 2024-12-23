import express from "express";

import k8sController from "../controllers/k8sController.js";

const k8sRouter = express.Router();

k8sRouter.post(
  "/restartPod",
  k8sController.checkClickedPod,
  k8sController.softDeletePod,
  (req, res) => {
    return res.status(200).json({ status: "success" });
  },
);

k8sRouter.post(
  "/viewPodLogs",
  k8sController.checkClickedPod,
  k8sController.fetchPodLogs,
  k8sController.formatPodLogs,
  (req, res) => {
    return res.status(200).json({ logs: res.locals.logs });
  },
);

k8sRouter.post("/replicas", k8sController.scaleReplicas, (req, res) => {
  return res.status(200).json(res.locals.newReplicas);
});

export default k8sRouter;
