const isValidLevel = (str) => {
  const allowedLevels = ["pod", "namespace", "node", "cluster"];
  if (!allowedLevels.includes(str)) {
    return false;
  }
  return true;
};

const isValidType = (str) => {
  const allowedTypes = ["cpu", "memory"];
  if (!allowedTypes.includes(str)) {
    return false;
  }
  return true;
};

export const parseRequestAllPodsStatus = (req, res, next) => {
  return next();
};

export const parseRequestAllPodsRequestLimit = (req, res, next) => {
  return next();
};

export const parseRequestResourceUsageOneValue = (req, res, next) => {
  if (!req.body.type || !req.body.time || !req.body.level) {
    return next({
      log: "Error in parseRequestResourceUsageOneValue middleware",
      status: 400,
      message: { err: "Missing required parameters" },
    });
  }
  if (!isValidType(req.body.type)) {
    return next({
      log: "Error in parseRequestResourceUsageOneValue middleware",
      status: 400,
      message: { err: "Invalid type, must be cpu or memory" },
    });
  }
  if (!req.body.time.match(/^(\d+)(s|m|h|d)$/)) {
    return next({
      log: "Error in parseRequestResourceUsageOneValue middleware",
      status: 400,
      message: { err: "Invalid time format. Use format: {number}s|m|h|d" },
    });
  }
  if (!isValidLevel(req.body.level)) {
    return next({
      log: "Error in parseRequestResourceUsageOneValue middleware",
      status: 400,
      message: {
        err: "Invalid level, must be pod, namespace, node, or cluster",
      },
    });
  }
  const { type, time, level } = req.body;
  res.locals.type = type;
  res.locals.timeWindow = time;
  res.locals.level = level;
  return next();
};

export const parseRequestResourceUsageHistorical = (req, res, next) => {
  if (
    !req.body.type ||
    !req.body.timeStart ||
    !req.body.timeEnd ||
    !req.body.timeStep ||
    !req.body.level
  ) {
    return next({
      log: "Error in parseRequestResourceUsageHistorical middleware",
      status: 400,
      message: { err: "Missing required parameters" },
    });
  }

  if (!isValidType(req.body.type)) {
    return next({
      log: "Error in parseRequestResourceUsageHistorical middleware",
      status: 400,
      message: { err: "Invalid type, must be cpu or memory" },
    });
  }

  // check if timestart and timeend are in valid unix timestamps format, also checking timestep
  if (
    !req.body.timeStart.match(/^\d+(\.\d{1,3})?$/) ||
    !req.body.timeEnd.match(/^\d+(\.\d{1,3})?$/) ||
    !req.body.timeStep.match(/^\d+$/)
  ) {
    return next({
      log: "Error in parseRequestResourceUsageHistorical middleware",
      status: 400,
      message: { err: "Invalid time format. Use unix timestamp" },
    });
  }

  if (!isValidLevel(req.body.level)) {
    return next({
      log: "Error in parseRequestResourceUsageHistorical middleware",
      status: 400,
      message: {
        err: "Invalid level, must be pod, namespace, node, or cluster",
      },
    });
  }

  res.locals.isHistorical = true;
  const { type, timeStart, timeEnd, timeStep, level } = req.body;
  res.locals.type = type;
  res.locals.timeStart = timeStart;
  res.locals.timeEnd = timeEnd;
  res.locals.timeStep = timeStep;
  res.locals.level = level;
  res.locals.timeWindow = timeStep + "s";
  return next();
};

export const parseRequestLatencyAppRequestOneValue = (req, res, next) => {
  if (!req.body.time.match(/^(\d+)(s|m|h|d)$/)) {
    return next({
      log: "Error in parseRequestLatencyAppRequestOneValue middleware",
      status: 400,
      message: { err: "Invalid time format. Use format: {number}s|m|h|d" },
    });
  }

  if (!isValidLevel(req.body.level)) {
    return next({
      log: "Error in parseRequestLatencyAppRequestOneValue middleware",
      status: 400,
      message: {
        err: "Invalid level, must be pod, namespace, node, or cluster",
      },
    });
  }

  const { time, level } = req.body;
  res.locals.timeWindow = time;
  res.locals.level = level;
  return next();
};

export const parseRequestLatencyAppRequestHistorical = (req, res, next) => {
  if (
    !req.body.timeStart ||
    !req.body.timeEnd ||
    !req.body.timeStep ||
    !req.body.level
  ) {
    return next({
      log: "Error in parseRequestLatencyAppRequestHistorical middleware",
      status: 400,
      message: { err: "Missing required parameters" },
    });
  }

  if (
    !req.body.timeStart.match(/^\d+(\.\d{1,3})?$/) ||
    !req.body.timeEnd.match(/^\d+(\.\d{1,3})?$/) ||
    !req.body.timeStep.match(/^\d+$/)
  ) {
    return next({
      log: "Error in parseRequestLatencyAppRequestHistorical middleware",
      status: 400,
      message: { err: "Invalid time format. Use unix timestamp" },
    });
  }

  if (!isValidLevel(req.body.level)) {
    return next({
      log: "Error in parseRequestLatencyAppRequestHistorical middleware",
      status: 400,
      message: {
        err: "Invalid level, must be pod, namespace, node, or cluster",
      },
    });
  }

  res.locals.isHistorical = true;
  const { timeStart, timeEnd, timeStep, level } = req.body;
  res.locals.timeStart = timeStart;
  res.locals.timeEnd = timeEnd;
  res.locals.timeStep = timeStep;
  res.locals.level = level;
  res.locals.timeWindow = timeStep + "s";
  return next();
};
