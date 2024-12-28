import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "node:url";

// Config path for usability in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  parseRequestAllPodsStatus,
  parseRequestAllPodsRequestLimit,
  parseRequestResourceUsageOneValue,
  parseRequestResourceUsageHistorical,
  parseRequestLatencyAppRequestOneValue,
  parseRequestLatencyAppRequestHistorical,
} from "../controllers/requestParsingController.js";

import {
  generateQueryAllPodsStatus,
  generateQueryAllPodsRequestLimit,
  generateQueryResourceUsage,
  generateQueryLatencyAppRequest,
} from "../controllers/promqlController.js";

import {
  //   runSinglePromQLQuery,
  runMultiplePromQLQueries,
} from "../controllers/prometheusController.js";

import {
  parseResponseAllPodsStatus,
  parseResponseAllPodsRequestLimit,
  parseResponseResourceUsageOneValue,
  parseResponseResourceUsageHistorical,
  parseResponseLatencyAppRequestOneValue,
  parseResponseLatencyAppRequestHistorical,
} from "../controllers/responseParsingController.js";

const apiRouter = express.Router();

const cacheDataToFile = (location) => {
  return (req, res, next) => {
    // Grab data to store from res.locals
    const dataToStore = res.locals.parsedData || {};
    // Configure path to data file
    const dataFilePath = path.join(__dirname, "//data", `${location}.json`);
    // Format data
    const dataToWrite = JSON.stringify(dataToStore, null, 2);
    // Write data to file but this overwrites the file
    fs.writeFile(dataFilePath, dataToWrite, "utf8", (err) => {
      if (err) {
        return next({
          log: "Error saving data to file",
          status: 500,
          message: {
            err: err,
          },
        });
      }
    });
  };
};

apiRouter.get(
  "/all-pods-status",
  parseRequestAllPodsStatus,
  generateQueryAllPodsStatus,
  runMultiplePromQLQueries,
  parseResponseAllPodsStatus,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.get(
  "/all-pods-request-limit",
  parseRequestAllPodsRequestLimit,
  generateQueryAllPodsRequestLimit,
  runMultiplePromQLQueries,
  parseResponseAllPodsRequestLimit,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/resource-usage-onevalue",
  parseRequestResourceUsageOneValue,
  generateQueryResourceUsage,
  runMultiplePromQLQueries,
  parseResponseResourceUsageOneValue,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/resource-usage-historical",
  parseRequestResourceUsageHistorical,
  generateQueryResourceUsage,
  runMultiplePromQLQueries,
  parseResponseResourceUsageHistorical,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/latency-app-request-onevalue",
  parseRequestLatencyAppRequestOneValue,
  generateQueryLatencyAppRequest,
  runMultiplePromQLQueries,
  parseResponseLatencyAppRequestOneValue,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/latency-app-request-historical",
  parseRequestLatencyAppRequestHistorical,
  generateQueryLatencyAppRequest,
  runMultiplePromQLQueries,
  parseResponseLatencyAppRequestHistorical,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

export default apiRouter;
