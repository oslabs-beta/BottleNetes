// import path from "path";
import express from "express";
// import cors from "cors";
import cookieParser from "cookie-parser";

import { runPromQLQuery } from "./controllers/prometheusController.js";
import { generateQuery } from "./controllers/promqlController.js";
import { generateErrorQuery, queryForErrors } from "./controllers/errorRateController.js"
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/query", generateQuery, runPromQLQuery, (req, res) => {
  res.status(200).json(res.locals.data);
});

app.post("/errorrate", generateErrorQuery, queryForErrors, (req, res) => {
  res.status(200).json(res.locals.data);
});

app.use((err, req, res, next) => {
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
