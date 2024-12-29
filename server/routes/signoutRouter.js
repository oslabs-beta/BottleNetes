import express from 'express';

import cookieController from '../controllers/cookieController.js';

const signoutRouter = express.Router();

signoutRouter.post('/', cookieController.deleteCookie, (req, res) => {
  return res.status(200).json("Success. You have successfully signed out.");
});

export default signoutRouter;