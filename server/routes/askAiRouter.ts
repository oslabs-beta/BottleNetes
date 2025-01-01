//askAiRouter.js - Router for POST /askAi endpoint

import express, { Request, Response } from "express";
import askAiController from "../controllers/askAiController.js";

const askAiRouter = express.Router();

askAiRouter.post("/askAi", askAiController.queryOpenAI, (_req: Request, res: Response) => {
  res.status(200).json({ success: true, analysis: res.locals.analysis });
});

export default askAiRouter;
