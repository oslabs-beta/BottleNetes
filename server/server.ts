/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import process from "node:process";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "node:url";

import { connectDB } from "./db/db.js";
import sequelize from "./db/db.js";

// Config path for usability in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routers
import askAiRouter from "./routes/askAiRouter.js";
import apiRouter from "./routes/apiRouter.js";
import k8sRouter from "./routes/k8sRouter.js";
import oAuthRouter from "./routes/oAuthRouter.js";
import userRouter from './routes/userRouter.js';

// Allow the use of process.env
const envFile =
  process.env.NODE_ENV === "production" ? ".env.production" : ".env";
dotenv.config({ path: envFile });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS stuffs
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Front-end PORT for Development
      "http://localhost:3000", // Back-end PORT
      "http://localhost:4173", // Front-end PORT for Production
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Important for cookies/session
  }),
);

// Connect to PORT 3000
const PORT = 3000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`😉 Environment: ${process.env.NODE_ENV}`);
});

// Connect to DB
connectDB();

// Routers
app.use("/user", userRouter);
app.use("/api", apiRouter);
app.use("/oauth", oAuthRouter);
app.use("/k8s", k8sRouter);
app.use("/ai", askAiRouter);

// Serves static files
app.use("/index", express.static(path.resolve(__dirname, "../index.html")));
app.use(express.static(path.resolve(__dirname, "./")));
app.use(express.static(path.resolve(__dirname, "../src/")));

app.get("/", (_req, res) => {
  return res.status(200).sendFile(path.resolve(__dirname, "../index.html"));
});

// Health Check Route
app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Catch All Route
app.get("*", (_req, res) => {
  res.sendStatus(404);
});

// Global Error Handler

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  const defaultErr = {
    log: `Express error handler caught unknown middleware error: ${err}`,
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  res.status(errorObj.status).json(errorObj.message);
});

// Gracefully shut down when exiting the app
let isShuttingDown = false;

const gracefulShutDown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log("👂 Received Shut Down Signal. Gracefully Shutting Down...");

  try {
    await sequelize.close();
    console.log("📉 Database connection is closed!");
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) reject(err);
        resolve();
      });
    });
    console.log(`💃🏻 Server has been shutted down gracefully!`);
    process.exitCode = 0;
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
