import express from "express";
import dotenv from "dotenv";
import process from "node:process";
import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";

import cookieController from "../controllers/cookieController.js";

dotenv.config();

const oAuthRouter = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, { profile, accessToken });
    },
  ),
);

oAuthRouter.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  cookieController.createCookie,
  (_req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL}`);
  },
);

oAuthRouter.get(
  "/google",
  passport.authenticate("google", { scope: ["profile"] }),
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_REDIRECT_URI,
    },
    (accessToken, refreshToken, profile, done) => {
      done(null, { profile, accessToken });
    },
  ),
);

oAuthRouter.get(
  "/github/callback",
  passport.authenticate("github", { session: false }),
  cookieController.createCookie,
  (_req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL}`);
  },
);

oAuthRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["read:user"] }),
);

export default oAuthRouter;
