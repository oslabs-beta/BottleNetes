import express from "express";
// import cors from "cors";
import cookieParser from "cookie-parser";

import apiRouter from "./routes/api.js";

// import { runPromQLQuery } from "./controllers/prometheusController.js";
// import { generateQuery } from "./controllers/promqlController.js";
// import {
//   generateLatencyQuery,
//   queryForLatency,
// } from "./controllers/latencyController.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});

app.use("/api", apiRouter);

// app.post("/errorrate", generateErrorQuery, queryForErrors, (req, res) => {
//   res.status(200).json(res.locals.data);
// });
// app.post("/query", generateQuery, runPromQLQuery, (req, res) => {
//   res.status(200).json(res.locals.data);
// });

// app.post("/latency", generateLatencyQuery, queryForLatency, (req, res) => {
//   res.status(200).json(res.locals.data);
// });

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

const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
