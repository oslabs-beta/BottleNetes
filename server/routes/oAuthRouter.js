import express from "express";
import dotenv from "dotenv";

import oAuthGitHubController from "../controllers/oAuthGitHubController.js";

dotenv.config();

const oAuthRouter = express.Router();

oAuthRouter.get(
  "/github",
  oAuthGitHubController.getTemporaryCode,
  oAuthGitHubController.requestToken,
  oAuthGitHubController.getGithubUsername,
  (_req, res) => {
    return res.status(200).json({
      success: true,
      username: res.locals.username,
      user: res.locals.user,
      token: res.locals.token,
    });
  },
);

export default oAuthRouter;
