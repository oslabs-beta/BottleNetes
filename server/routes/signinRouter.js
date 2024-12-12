import express from 'express';
import userController from '../controllers/userController.js';

const signinRouter = express.Router();

signinRouter.post("/", userController.verifyUser, (_req, res) => {
  if (res.locals.validated) return res.redirect("/dashboard");
  return res.status(400).json("😥 Incorrect Credential");
});

export default signinRouter;