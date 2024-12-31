//askAiRouter.js - Router for POST /askAi endpoint
//Original Code (Commented Out)

import express from "express";
import askAiController from "../controllers/askAiController.js";

const askAiRouter = express.Router();

const check = (req, res, next) => {
  console.log("askAi router hit");
  return next();
};

askAiRouter.post("/askAi", check, askAiController.queryOpenAI, (req, res) => {
  return res.status(200).json({ success: true, analysis: res.locals.analysis });
});

export default askAiRouter;
