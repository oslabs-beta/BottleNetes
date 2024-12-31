/**
 * Contains middlewares:
 * createCookie: Create Cookie when user sign in
 * verifyCookie: Check if the user has already signed in
 */

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "node:process";
import { Request, Response, NextFunction } from "express";

interface UserProfile {
  id: string;
  displayName: string;
  provider: string;
}

interface User {
  profile: UserProfile;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: User;
  }
}

import { SECRET_KEY } from "../jwtUtils.js";
import genToken from "../jwtUtils.js";
import Users from "../models/UserModel.js";
// import UsersGitHub from "../models/UsersGitHubModel";
// import UsersGoogle from "../models/UsersGoogleModel";

dotenv.config();

interface CookieController {
  createCookie: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  verifyCookie: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
  deleteCookie: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<void>;
}

const cookieController: CookieController = {
  // Create the cookie with their id for their session when the user signed in
  createCookie: async (req, res, next) => {
    console.log("🍪 Running createCookie middleware...");

    try {
      // If authenticated by OAuth then run this block
      if (req.user) {
        const { profile } = req.user;
        // Capitalize the first word
        const provider = profile.provider
          .split(" ")
          .map((word: string) => word[0].toUpperCase() + word.substring(1))
          .join(" ");
        console.log(`Now signing in using ${provider} Account...`);

        const token = genToken(
          profile.id,
          profile.displayName,
          profile.provider,
        );
        await res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 60,
        });

        console.log(`🍪 Filling up your ${provider} cookie basket...`);
        return next();
      }

      // If user signed in using our app then run this block
      else {
        const { username } = await req.body;

        const foundUserID = await Users.findOne({
          where: { username },
          attributes: ["id"],
        });

        if (!foundUserID) {
          return next({
            log: `🤨 Could not find user. Cookie will not be created`,
            status: 401,
            message: "Error occurred while retrieving cookies...",
          });
        }
        const token = genToken(foundUserID.dataValues.id, username);

        await res.cookie("jwt", token, {
          httpOnly: true, // Prevent access via JS
          secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production,
          sameSite: "strict", // Protect against CSRF
          maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
        });

        console.log(`🍪 Filling up the cookie basket...`);

        res.locals.token = token;
        res.locals.id = foundUserID.dataValues.id;
      }
      return next();
    } catch (error) {
      return next({
        log: `🍪❌ Error occurred in createCookie middleware: ${error}`,
        status: 500,
        message: "Cannot create your Cookies!",
      });
    }
  },

  // Verify the cookie with their id to make sure they are the correct signed in user
  verifyCookie: async (req, res, next) => {
    console.log(`🍪🤔 Running verifyCookie middleware...`);

    try {
      const token = await req.cookies.jwt;

      if (!token) {
        res.locals.signedIn = false;
        return next({
          log: "🥲 Auth token is missing",
          status: 401,
          message: "Token not found",
        });
      }

      const decoded = jwt.verify(token, SECRET_KEY) as jwt.JwtPayload;

      res.locals.username = decoded.username;
      res.locals.signedIn = true;
      console.log(`🍪 Verified session. Enjoy your dashboard!`);
      return next();
    } catch (error) {
      return next({
        log: `😭 Error in verifyCookie middleware: ${error}`,
        status: 500,
        message: "Error while verifying session...",
      });
    }
  },

  deleteCookie: async (_req, res, next) => {
    console.log("🍪🔥 Now running deleteCookie middleware...");

    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });
      return next();
    } catch (error) {
      return next({
        log: `Error occurred in deleteCookie middleware: ${error}`,
        status: 500,
        message: "Error while clearing your session",
      });
    }
  },
};

export default cookieController;
