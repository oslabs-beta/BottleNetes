import express from "express";

import userController from "../controllers/userController.js";

const signupRouter = express.Router();

signupRouter.post("/", userController.createNewUser, (_req, res) => {
  if (res.locals.newUser) {
    console.log(`🫡 New User Created! Redirecting to Homepage...`);
    res.locals.newUser = null;
    return res.redirect("/");
  }
  return res.status(400).json("Failed to create new user...");
});

export default signupRouter;
