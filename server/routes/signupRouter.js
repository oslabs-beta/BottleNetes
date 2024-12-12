/* eslint-disable no-undef */
import express from 'express';
import path from 'path'

import userController from '../controllers/userController.js';

const signupRouter = express.Router();

signupRouter.get("/", (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, "../../signup.html"));
});

signupRouter.post("/", userController.createNewUser, (req, res) => {
  return res.redirect('/signin');
});

export default signupRouter;