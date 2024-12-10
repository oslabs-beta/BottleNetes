import fetch from "node-fetch";
import moment from "moment";

export const generateErrorQuery = (req, res, next) => {
  console.log("GENERATE ERROR MIDDLEWARE");
  const query = req.body;
  const queriesArr = {};
  const endTime = moment().toISOString();
  const startTime = moment().subtract(12, "hours").toISOString();
  // console.log(query)
  // console.log("about to enter for loop")
  for (let key in query) {
    queriesArr[key] =
      `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(query[key])}&start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}&step=3600s`;
  }

  // console.log("exited for loop")
  res.locals.errorRateQueries = queriesArr;
  // console.log(res.locals.errorRateQueries);
  console.log("DONE WITH GENERATE ERROR MIDDLEWARE");
  return next();
};

export const queryForErrors = async (req, res, next) => {
  console.log("QUERY FOR ERRORS MIDDLEWARE");
  const { errorRateQueries } = res.locals;
  const queryResults = {};
  for (const key in errorRateQueries) {
    try {
      // query
      console.log(key);
      const response = await fetch(errorRateQueries[key]);
      const data = await response.json();
      queryResults[key] = data;
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
  console.log("DONE QUERYING PROMETHEUS");
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
