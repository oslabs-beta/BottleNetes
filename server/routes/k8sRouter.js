import express from "express";

import k8sController from "../controllers/k8sController.js";

const k8sRouter = express.Router();

k8sRouter.post(
  "/restartPod",
  k8sController.checkClickedPod,
  k8sController.softDeletePod,
  (_req, res) => {
    return res.status(200).json({ status: "success" });
  },
);

k8sRouter.post(
  "/viewPodLogs",
  k8sController.checkClickedPod,
  k8sController.fetchPodLogs,
  k8sController.formatLogs,
  (_req, res) => {
    return res.status(200).json({ logs: res.locals.logs });
  },
);

k8sRouter.post(
  "/replicas",
  k8sController.checkClickedPod,
  k8sController.getDeployment,
  k8sController.readDeployment,
  k8sController.scaleReplicas,
  (_req, res) => {
    return res.status(200).json({
      message: `Successfully updated replicas for '${res.locals.deployment}' Deployment.`,
      data: {
        deployment: res.locals.deployment,
        updatedReplicas: res.locals.updatedReplicas,
      },
    });
  },
);

k8sRouter.post(
  "/requestsLimits",
  k8sController.checkClickedPod,
  k8sController.getDeployment,
  k8sController.readDeployment,
  k8sController.adjustRequestLimit,
  (_req, res) => {
    return res.status(200).json({
      message: `Successfully updated resources and limits for '${res.locals.deployment}' Deployment.`,
      data: {
        deployment: res.locals.deployment,
        updatedRequests: res.locals.newRequests,
        updatedLimits: res.locals.newLimits,
      },
    });
  },
);

export default k8sRouter;
