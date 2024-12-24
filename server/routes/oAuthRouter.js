import express from "express";
import dotenv from "dotenv";

import oAuthGitHubController from "../controllers/oAuthGitHubController.js";
import cookieController from "../controllers/cookieController.js";

dotenv.config();

const oAuthRouter = express.Router();

oAuthRouter.get(
  "/github",
  oAuthGitHubController.getTemporaryCode,
  oAuthGitHubController.requestToken,
  oAuthGitHubController.getGithubUsername,
  // oAuthGitHubController.genJWT,
  cookieController.createCookie,
  (_req, res) => {
    return res.redirect("/dashboard");
  },
);

export default oAuthRouter;
