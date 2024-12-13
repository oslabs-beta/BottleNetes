import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import userController from "../controllers/userController.js";

const signupRouter = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

signupRouter.get("/", (req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, "../../signup.html"));
});

signupRouter.post("/", userController.createNewUser, (req, res) => {
  if (res.locals.newUser) {
    console.log(`🫡 New User Created! Redirecting to Homepage...`);
    res.locals.newUser = null;
    return res.redirect("/");
  }
  return res.status(400).json("Failed to create new user...");
});

export default signupRouter;
