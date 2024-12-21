import express from 'express';

import k8sController from '../controllers/k8sController.js';

const k8sRouter = express.Router();

k8sRouter.post('/replicas', k8sController.scaleReplicas, (req, res) => {
  return res.status(200).json(res.locals.newReplicas);
});

export default k8sRouter;