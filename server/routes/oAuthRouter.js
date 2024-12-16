import express from "express";
import dotenv from "dotenv";
import process from 'node:process';

import oAuthGitHubController from "../controllers/oAuthGitHubController.js";

dotenv.config();

const oAuthRouter = express.Router();

const clientID = process.env.GITHUB_CLIENT_ID;
const redirectUri = process.env.GITHUB_REDIRECT_URI;

oAuthRouter.get("/github", (_req, res) => {
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientID}&redirectredirect_url=${redirectUri}`;
  return res.redirect(githubAuthUrl);
});

oAuthRouter.get(
  "/github/callback",
  oAuthGitHubController.getTemporaryCode,
  oAuthGitHubController.requestToken,
  oAuthGitHubController.getGithubUsername,
  (_req, res) => {
    return res.status(200).json({
      success: true,
      username: res.locals.username,
      user: res.locals.user,
    });
  }
);

export default oAuthRouter;
