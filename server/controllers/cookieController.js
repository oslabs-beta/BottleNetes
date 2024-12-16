/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../utils/jwtUtils.js";
import dotenv from "dotenv";

import Users from "../models/UserModel.js";
import genToken from "../../utils/jwtUtils.js";

dotenv.config();

const cookieController = {};

// Create the cookie with their id for their session when the user signed in
cookieController.createCookie = async (req, res, next) => {
  console.log("🍪 Running createCookie middleware...");

  try {
    let { username } = await req.body;

    const foundUserID = await Users.findOne({
      where: { username },
      attributes: ["id"],
    });

    if (foundUserID) {
      const token = genToken(foundUserID.dataValues.id);
      const cookie = await res.cookie("jwt", token, {
        httpOnly: true, // Prevent access via JS
        secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production,
        sameSite: "strict", // Protect against CSRF
        maxAge: 24 * 60 * 60 * 1000, // 1 day in ms
      });
      console.log(`🍪 Filling up the cookie basket...`);
      res.locals.cookie = cookie;
      // console.log(res.locals.cookie.req.cookies.ssid);
      res.locals.id = foundUserID.dataValues.id;
      // console.log(res.locals.id);
      return next();
    } else {
      return next({
        log: `🤨 Could not find user. Cookie will not be created`,
        status: 401,
        message: "Error occurred while retrieving cookies...",
      });
    }
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
    // Check if the cookie ssid matches the user id
    if (token) {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.locals.decoded = decoded;
      console.log(`🍪 Verified session. Enjoy your dashboard!`);
      res.locals.signedIn = true;
      return next();
      // If they're not match, redirect them to the sign in page
    } else {
      res.locals.signedIn = false;
      return next({
        log: "🥲 Auth token is missing",
        status: 401,
        message: "Token not found",
      });
    }
  } catch (error) {
    return next({
      log: `😭 Error in verifyCookie middleware: ${error}`,
      status: 500,
      message: "Error while verifying session...",
    });
  }
};

export default cookieController;
