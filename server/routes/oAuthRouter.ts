/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import process from "node:process";
import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import cookieController from "../controllers/cookieController.js";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });


const oAuthRouter = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "",
    },
    (accessToken, _refreshToken, profile, done) => {
      done(null, { profile, accessToken });
    },
  ),
);

oAuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  cookieController.createCookie,
  (_req: Request, res: Response) => {
    res.redirect(`${process.env.FRONTEND_URL}`);
  },
);

oAuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
);

interface GitHubProfile {
  id: string;
  displayName: string;
  username: string;
  profileUrl: string;
  emails: { value: string }[];
  photos: { value: string }[];
}

interface GitHubDone {
  (error: any, user?: { profile: GitHubProfile; accessToken: string }): void;
}

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      callbackURL: process.env.GITHUB_REDIRECT_URI || "",
    },
    (accessToken: string, _refreshToken: string, profile: GitHubProfile, done: GitHubDone) => {
      done(null, { profile, accessToken });
    },
  ),
);

oAuthRouter.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  cookieController.createCookie,
  (_req: Request, res: Response) => {
    res.redirect(`${process.env.FRONTEND_URL}`);
  },
);

oAuthRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user"] }),
);

export default oAuthRouter;
