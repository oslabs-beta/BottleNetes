import express from "express";

import userController from "../controllers/userController.js";
import cookieController from "../controllers/cookieController.js";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  userController.verifyUser,
  cookieController.createCookie,
  (_req, res) => {
    if (res.locals.validated) {
      return res.status(200).send({
        success: true,
        username: res.locals.username,
      });
    } else return res.redirect("/");
  },
);

userRouter.get(
  "/signin/checkSignin",
  cookieController.verifyCookie,
  (_req, res) => {
    return res.status(200).send({
      signedIn: res.locals.signedIn,
      username: res.locals.username,
    });
  },
);

userRouter.post("/signout", cookieController.deleteCookie, (_req, res) => {
  return res.status(200).json("Success. You have successfully signed out.");
});

userRouter.post("/signup", userController.createNewUser, (_req, res) => {
  if (res.locals.newUser) {
    return res.status(200).json({
      message:
        "🤓 Successfully created new user. Redirecting to Sign In Page...",
      data: {
        username: res.locals.newUser.username,
        firstName: res.locals.newUser.first_name,
        lastName: res.locals.newUser.last_name,
        email: res.locals.newUser.email,
      },
    });
  }
  return res.status(400).json("Failed to create new user...");
});

export default userRouter;
