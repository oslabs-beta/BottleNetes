/* eslint-disable no-unused-vars */
import express from "express";
import cookieParser from "cookie-parser";
import sequelize, { connectDB } from "./db/db.js";
import process from "node:process";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";

import { runPromQLQuery } from "./controllers/prometheusController.js";
import { generateQuery } from "./controllers/promqlController.js";
import {
  generateErrorQuery,
  queryForErrors,
} from "./controllers/errorRateController.js";
import userController from "./controllers/userController.js";

// Import Routers
import signupRouter from './routes/signupRouter.js';
import signinRouter from './routes/signinRouter.js';

// Allow the use of process.env
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS stuffs
app.use(
  cors({
    origin: "http://localhost:5173", //Front-end PORT
    credentials: true, // Important for cookies/session
  }),
);

app.use((_req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  return next();
});

// Session Configuration
app.use(
  session({
    secret: process.env.SECRET_SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // Cookie stays for 24hrs
      sameSite: "lax",
      httpOnly: true,
    },
  }),
);

// Connect to PORT 3000
const PORT = 3000;
const server = app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`),
);

// Connect to DB
connectDB();

// Routers
app.use('/signin', signinRouter);
app.use('/signup', signupRouter);

app.post("/query", generateQuery, runPromQLQuery, (_req, res) => {
  return res.status(200).json(res.locals.data);
});

app.post("/errorrate", generateErrorQuery, queryForErrors, (_req, res) => {
  return res.status(200).json(res.locals.data);
});

// Catch All Route
app.use("*", (_req, res) => {
  return res.sendStatus(404);
});

// Global Error Handler
app.use((err, _req, res, _next) => {
  const defaultErr = {
    log: "Express error handler caught unknown middleware error",
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);

  return res.status(errorObj.status).json(errorObj.message);
});

// Gracefullt shut down when exiting the app
const gracefulShutDown = async () => {
  try {
    console.log("👂 Received Shut Down Signal. Gracefully Shutting Down...");
    await sequelize.close();
    console.log("📉 Database connection is closed!");
    server.close(() => {
      console.log(`💃🏻 Server has been shutted down gracefully!`);
      process.exitCode = 0;
    })
  } catch (error) {
    console.error(
      `😭 Unable to gracefully shut down the server. Force exiting... - ${error}`,
    );
    process.exitCode = 1;
  }
};

// Shutdown signals
process.on("SIGINT", gracefulShutDown);
process.on("SIGTERM", gracefulShutDown);
