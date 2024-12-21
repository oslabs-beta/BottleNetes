/* eslint-disable no-undef */
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const SECRET_KEY = process.env.SECRET_SESSION_KEY;
const EXPIRE_IN = "1d";

const genToken = (userId) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: EXPIRE_IN });
};

export default genToken;