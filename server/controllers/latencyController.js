import fetch from "node-fetch";
// import moment from "moment";

export const generateLatencyQuery = (req, res, next) => {
  console.log("1. GENERATE ERROR MIDDLEWARE");
  const query = req.body;
  const queriesArr = {};
  // const endTime = moment().toISOString();
  // const startTime = moment().subtract(12, "hours").toISOString();
  // CONVERT TIME TO UNIT TIME INSTEAD OF ISO!!
  for (let key in query) {
    queriesArr[key] =
      // `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(query[key])}&start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}&step=3600s`;
      `http://localhost:9090/api/v1/query?query=${encodeURIComponent(query[key])}`;
  }
  res.locals.errorRateQueries = queriesArr;
  // console.log(res.locals.errorRateQueries);
  console.log("2. DONE WITH GENERATE ERROR MIDDLEWARE");
  return next();
};

export const queryForLatency = async (req, res, next) => {
  console.log("3. QUERY FOR ERRORS MIDDLEWARE");
  const { errorRateQueries } = res.locals;
  // const queryResults = {};
  for (const key in errorRateQueries) {
    try {
      const response = await fetch(errorRateQueries[key]);
      const data = await response.json();
      console.log(data.data.result);
      // NEED TO: add results tp queryResults object
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
  // NEED TO: add data to res.locals
  console.log("4. DONE QUERYING PROMETHEUS");
  return next();
};

/*

export const runPromQLQuery = async (req, res, next) => {
  const queryStr = res.locals.query;
  const url = `http://localhost:9090/api/v1/query?query=${encodeURIComponent(
    queryStr,
  )}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.locals.data = data.data.result;
    console.log("url", url);
    return next();
  } catch (error) {
    return next({
      log: "Error in runPromQLQuery middleware" + error,
      status: 500,
      message: { err: "An error occurred" },
    });
  }
};
*/
