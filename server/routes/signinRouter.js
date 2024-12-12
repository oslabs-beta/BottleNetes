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
        message: 'Login Successful!',
        id: res.locals.id,
        username: res.locals.username
        // redirectUrl: '/dashboard',
        // userData: {
          // id: res.locals.id
        // }
      });
    } else return res.redirect('/');
  },
);

export default signinRouter;
