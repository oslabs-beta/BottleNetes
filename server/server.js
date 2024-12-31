/* eslint-disable no-unused-vars */
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import process from "node:process";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "node:url";

import { connectDB } from "./db/db.js";
import sequelize from "./db/db.js";
import userController from "./controllers/userController.js";

// Config path for usability in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routers
import askAiRouter from "./routes/askAiRouter.js";
import apiRouter from "./routes/apiRouter.js";
import k8sRouter from "./routes/k8sRouter.js";
import oAuthRouter from "./routes/oAuthRouter.js";
import userRouter from "./routes/userRouter.js";
// Allow the use of process.env
dotenv.config();

const app = express();

// Request Logging Middleware
// app.use((req, res, next) => {
//   console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
//   next();
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// increase limits
app.use(express.json({ limit: "750mb" }));
app.use(express.urlencoded({ extended: true, limit: "750mb" }));

// CORS stuffs
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], //Front-end PORT
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Important for cookies/session
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
app.use("*", (_req, res) => {
  return res.sendStatus(404);
});

// Global Error Handler

app.use((err, _req, res, _next) => {
  const defaultErr = {
    log: `Express error handler caught unknown middleware error: ${err}`,
    status: 500,
    message: { err: "An error occurred" },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
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
    await new Promise((resolve, reject) => {
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
