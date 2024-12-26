import express from "express";
import dotenv from "dotenv";
import process from 'node:process';

import oAuthGitHubController from "../controllers/oAuthGitHubController.js";
import cookieController from "../controllers/cookieController.js";

dotenv.config();

const oAuthRouter = express.Router();

oAuthRouter.get(
  "/github/callback",
  oAuthGitHubController.getCode,
  oAuthGitHubController.requestToken,
  oAuthGitHubController.getGitHubUserData,
  cookieController.createCookie,
  (_req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL}`);
  },
);

export default oAuthRouter;
