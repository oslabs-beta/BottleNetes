import express from "express";

import {
  parseRequestAllPodsStatus,
  parseRequestAllPodsRequestLimit,
  parseRequestResourceUsageOneValue,
  parseRequestResourceUsageHistorical,
  parseRequestLatencyAppRequestOneValue,
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
} from "../controllers/responseParsingController.js";

const router = express.Router();

router.get(
  "/all-pods-status",
  parseRequestAllPodsStatus,
  generateQueryAllPodsStatus,
  runMultiplePromQLQueries,
  parseResponseAllPodsStatus,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

router.get(
  "/all-pods-request-limit",
  parseRequestAllPodsRequestLimit,
  generateQueryAllPodsRequestLimit,
  runMultiplePromQLQueries,
  parseResponseAllPodsRequestLimit,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

router.post(
  "/resource-usage-onevalue",
  parseRequestResourceUsageOneValue,
  generateQueryResourceUsage,
  runMultiplePromQLQueries,
  parseResponseResourceUsageOneValue,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

router.post(
  "/resource-usage-historical",
  parseRequestResourceUsageHistorical,
  generateQueryResourceUsage,
  runMultiplePromQLQueries,
  parseResponseResourceUsageHistorical,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

router.post(
  "/latency-app-request-onevalue",
  parseRequestLatencyAppRequestOneValue,
  generateQueryLatencyAppRequest,
  runMultiplePromQLQueries,
  parseResponseLatencyAppRequestOneValue,
  (_req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

export default router;
