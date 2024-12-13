import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";

const userController = {};

// Middleware for when creating a new user
userController.createNewUser = async (req, res, next) => {
  console.log("👥 Running createNewUser middleware...");

  try {
    const { username, password, email } = await req.body;
    // Check if any required field is missing
    if (!username || !password || !email) {
      return next({
        log: "Required credentials are not provided",
        status: 500,
        message: "One or more required fields are missing.",
      });
    }

    // Check if username contains any non-word using Regex
    if (/\W/.test(username)) {
      return {
        log: `🤯 What kind of username is this?`,
        status: 400,
        message: "Username cannot contain special characters",
      };
    }

    // Create new rows for users table
    const newUser = await Users.create({
      username,
      password_hash: password,
      email,
    });
    console.log("✅ User created: ", newUser.toJSON());
    res.locals.newUser = newUser;
    return next();
  } catch (error) {
    return next({
      log: `🤦🏻 Error in createNewUser middleware: ${error}`,
      status: 500,
      message: "🤦🏻 Could not create new user",
    });
  }
};

// Middleware for when verifying user when they try to sign in
userController.verifyUser = async (req, res, next) => {
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
        res.locals.id = credentials.dataValues.id;
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
};

export default userController;
