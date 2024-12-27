import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import process from "node:process";

import { SECRET_KEY } from "../../utils/jwtUtils.js";
import Users from "../models/UserModel.js";
import genToken from "../../utils/jwtUtils.js";

dotenv.config();

const cookieController = {};

// Create the cookie with their id for their session when the user signed in
cookieController.createCookie = async (req, res, next) => {
  console.log("🍪 Running createCookie middleware...");

  try {
    // If authenticated by OAuth then run this block
    if (req.user) {
      const { profile } = req.user;
      // Capitalize the first word
      const provider = profile.provider
        .split(" ")
        .map((word) => word[0].toUpperCase() + word.substring(1))
        .join(" ");
      console.log(`Now signing in using ${provider} Account...`);

      const token = genToken(profile.id, profile.displayName, profile.provider);
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
      let { username } = await req.body;

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
};

// Verify the cookie with their id to make sure they are the correct signed in user
cookieController.verifyCookie = async (req, res, next) => {
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

    const decoded = jwt.verify(token, SECRET_KEY);

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
};

export default cookieController;
