import express from "express";
import userController from "../controllers/userController.js";
import cookieController from "../controllers/cookieController.js";

const signinRouter = express.Router();

signinRouter.post(
  "/",
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

signinRouter.get("/checkSignin", (_req, res) => {
  return res.status(200).send({
    signedIn: res.locals.signedIn,
    user: res.locals.decoded,
    username: res.locals.username
  });
});

export default signinRouter;
