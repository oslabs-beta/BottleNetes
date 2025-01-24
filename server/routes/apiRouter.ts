import express, { Request, Response } from "express";

import requestParsingController from "../controllers/requestParsingController.js";
import promQLController from "../controllers/promqlController.js";
import prometheusController from "../controllers/prometheusController.js";
import responseParsingController from "../controllers/responseParsingController.js";

const apiRouter = express.Router();

apiRouter.get(
  "/all-pods-status",
  requestParsingController.parseRequestAllPodsStatus,
  promQLController.generateQueryAllPodsStatus,
  prometheusController.runMultiplePromQLQueries,
  responseParsingController.parseResponseAllPodsStatus,
  (_req: Request, res: Response) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.get(
  "/all-pods-request-limit",
  requestParsingController.parseRequestAllPodsRequestLimit,
  promQLController.generateQueryAllPodsRequestLimit,
  prometheusController.runMultiplePromQLQueries,
  responseParsingController.parseResponseAllPodsRequestLimit,
  (_req: Request, res: Response) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/resource-usage-onevalue",
  requestParsingController.parseRequestResourceUsageOneValue,
  promQLController.generateQueryResourceUsage,
  prometheusController.runMultiplePromQLQueries,
  responseParsingController.parseResponseResourceUsageOneValue,
  (_req: Request, res: Response) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/resource-usage-historical",
  requestParsingController.parseRequestResourceUsageHistorical,
  promQLController.generateQueryResourceUsage,
  prometheusController.runMultiplePromQLQueries,
  responseParsingController.parseResponseResourceUsageHistorical,
  (_req: Request, res: Response) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/latency-app-request-onevalue",
  requestParsingController.parseRequestLatencyAppRequestOneValue,
  promQLController.generateQueryLatencyAppRequest,
  prometheusController.runMultiplePromQLQueries,
  responseParsingController.parseResponseLatencyAppRequestOneValue,
  (_req: Request, res: Response) => {
    res.status(200).json(res.locals.parsedData);
  },
);

apiRouter.post(
  "/latency-app-request-historical",
  requestParsingController.parseRequestLatencyAppRequestHistorical,
  promQLController.generateQueryLatencyAppRequest,
  prometheusController.runMultiplePromQLQueries,
  responseParsingController.parseResponseLatencyAppRequestHistorical,
  (_req: Request, res: Response) => {
    res.status(200).json(res.locals.parsedData);
  },
);

export default apiRouter;
