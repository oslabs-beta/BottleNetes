import fetch from "node-fetch";

export const generateLatencyQuery = (req, res, next) => {
  const query = req.body;
  const queriesArr = {};
  // const endTime = moment().toISOString();
  // const startTime = moment().subtract(12, "hours").toISOString();
  for (let key in query) {
    queriesArr[key] =
      `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query[key])}`;
  }
  res.locals.errorRateQueries = queriesArr;
  return next();
};

export const queryForLatency = async (_req, res, next) => {
  const { errorRateQueries } = res.locals;
  // const queryResults = {};
  for (const key in errorRateQueries) {
    try {
      const response = await fetch(errorRateQueries[key]);
      const data = await response.json();
      console.log(data.data.result);
      
    } catch (error) {
      const newErr = {
        message: "Error querying prometheus with: ",
        key,
        status: 500,
        log: { "ERROR QUERYING PROMETHEUS": error },
      };
      return next(newErr);
    }
  }
  return next();
};

