/**
 * Controller contains:
 * createNewUser: Save the new credential into DB
 * verifyUser: Check if the user sent the correct credentials
 */

import bcrypt from "bcrypt";
import { UserController } from "controller-types";

import Users from "../models/UserModel.js";
import UsersGitHub from "../models/UsersGitHubModel.js";
import UsersGoogle from "../models/UsersGoogleModel.js";
import { Profile } from "oauth-types";

// Helper function to create or update users in DB
const upsertUser = async (
  model: typeof UsersGitHub | typeof UsersGoogle,
  profile: Profile,
  accessToken: string,
) => {
  try {
    // Find if the same user is already signed in before
    const foundUser = await model.findOne({
      where: { display_name: profile.displayName },
    });

    // If they have not signed in before then create a row for that user
    if (!foundUser) {
      const newUser = await model.create({
        display_name: profile.displayName,
        access_token: accessToken,
      });
      console.log("✅ New User created: ", newUser.dataValues.display_name);
      return newUser.dataValues.display_name;
    }

    // If the user has signed in before, update their access token
    else {
      const newUser = await model.update(
        { access_token: accessToken },
        {
          where: { display_name: foundUser?.dataValues.display_name },
          returning: ["display_name"],
        },
      );
      console.log(
        "✅ Existing User Found: ",
        newUser[1][0].dataValues.display_name,
      );
      return newUser[1][0].dataValues.display_name;
    }
  } catch (error) {
    return undefined;
  }
};

const userController: UserController = {
  // Middleware for when creating a new user
  createNewUser: async (req, res, next) => {
    console.log("👥 Running createNewUser middleware...");

    try {
      // Run this block if users sign in with OAuth
      if (req.user) {
        const { profile, accessToken } = req.user;

        // Run this block if users signed in with GitHub
        if (profile.provider === "github") {
          const user = await upsertUser(UsersGitHub, profile, accessToken);

          if (!user) {
            return next({
              log: `🥲 Unable to create a new instance of user`,
              status: 500,
              message: "An error occurred. Please try again later",
            });
          }
        }

        // Otherwise run this block if users signed in using Google
        else if (profile.provider === "google") {
          const user = await upsertUser(UsersGoogle, profile, accessToken);

          if (!user) {
            return next({
              log: `🥲 Unable to create a new instance of user`,
              status: 500,
              message: "An error occurred. Please try again later",
            });
          }
        }
      }

      // If the user create a new account on our app then run this block
      else {
        const { username, password, email, firstName, lastName } =
          await req.body;
        // Check if any required field is missing
        if (!username || !password || !email || !firstName || !lastName) {
          return next({
            log: "Required credentials are not provided",
            status: 500,
            message: "One or more required fields are missing.",
          });
        }

        // Check if username contains any non-word using Regex
        if (/\W/.test(username)) {
          return next({
            log: `🤯 What kind of username is this?`,
            status: 400,
            message: "Username cannot contain special characters",
          });
        }

        // Create new rows for users table
        const newUser = await Users.create({
          username,
          password_hash: password,
          email,
          first_name: firstName,
          last_name: lastName,
        });
        console.log("✅ User created: ", newUser.toJSON());
        res.locals.newUser = newUser.toJSON();
      }
      return next();
    } catch (error) {
      return next({
        log: `🤦🏻 Error in createNewUser middleware: ${error}`,
        status: 500,
        message: "🤦🏻 Could not create new user",
      });
    }
  },

  // Middleware for when verifying user when they try to sign in
  verifyUser: async (req, res, next) => {
    console.log("🤖 Running verifyUser middleware...");

    try {
      const { username, password } = await req.body;
      // Find the corresponding row in the users table and return back the username and password_hash columns
      const credentials = await Users.findOne({
        where: { username },
        attributes: ["id", "username", "password_hash"],
      });

      // If the user is found, compare the input password to the hashed password
      if (credentials) {
        const isMatch = await bcrypt.compare(
          password,
          credentials.dataValues.password_hash,
        );
        // If the password matches, proceed
        if (isMatch) {
          console.log("🥳 Password Matched!");
          res.locals.validated = isMatch;
          res.locals.username = credentials.dataValues.username;
          return next();
        } else {
          console.log("🤔 Wrong Password!");
          res.locals.validated = isMatch;
          return next({
            log: `🤨 Credentials do not match!`,
            status: 401,
            message: "Provided credentials do not match.",
          });
        }
        // If the user is not found, then the provided credentials are wrong, direct to the error handler
      } else {
        return next({
          log: "🤨 Credential provided does not matched!",
          status: 401,
          message: "🤨 Credential provided does not matched!",
        });
      }
    } catch (error) {
      return next({
        log: `🤬 Error in verifyUser middleware: ${error}`,
        status: 500,
        message: "Could not log in...",
      });
    }
  },
};

export default userController;
