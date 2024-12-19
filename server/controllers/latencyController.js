import fetch from "node-fetch";
// import moment from "moment";

export const generateLatencyQuery = (req, res, next) => {
  const query = req.body;
  const queriesArr = {};
  // const endTime = moment().toISOString();
  // const startTime = moment().subtract(12, "hours").toISOString();
  for (let key in query) {
    queriesArr[key] =
      // `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(query[key])}&start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}&step=3600s`;
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
      // queryResults[key] = data;
      
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

