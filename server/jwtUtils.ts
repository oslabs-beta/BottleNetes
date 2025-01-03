import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });


export const SECRET_KEY = process.env.SECRET_SESSION_KEY || "";
const EXPIRE_IN = "1d";

const genToken = (userId: string, username: string, method: string = "app") => {
  return jwt.sign({ id: userId, username, method }, SECRET_KEY, {
    expiresIn: EXPIRE_IN,
  });
};

export default genToken;
