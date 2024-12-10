import express from "express";

import {
  runSinglePromQLQuery,
  runMultiplePromQLQueries,
} from "../controllers/prometheusController.js";

import {
  generateAllPodsStatusQuery,
  generateAllPodsRequestLimitQuery,
} from "../controllers/promqlController.js";

// import {
//   generateErrorQuery,
//   queryForErrors,
// } from "../controllers/errorRateController.js";

import {
  parseRequestAllPodsStatus,
  parseRequestAllPodsRequestLimit,
} from "../controllers/requestParsingController.js";

import {
  parseResponseAllPodsStatus,
  parseResponseAllPodsRequestLimit,
} from "../controllers/responseParsingController.js";

const router = express.Router();

router.get(
  "/all-pods-status",
  parseRequestAllPodsStatus,
  generateAllPodsStatusQuery,
  runMultiplePromQLQueries,
  parseResponseAllPodsStatus,
  (req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

router.get(
  "/all-pods-request-limit",
  parseRequestAllPodsRequestLimit,
  generateAllPodsRequestLimitQuery,
  runMultiplePromQLQueries,
  parseResponseAllPodsRequestLimit,
  (req, res) => {
    res.status(200).json(res.locals.parsedData);
  },
);

export default router;
