import fetch from "node-fetch";
import moment from "moment";

export const generateErrorQuery = (req, res, next) => {
  // console.log("We're in generate error query middleware: ", req.body);
  const query = req.body;
  const queriesArr = {};
  const endTime = moment().toISOString();
  const startTime = moment().subtract(12, "hours").toISOString();
  // console.log(query)
  // console.log("about to enter for loop")
  for (let key in query) {
    queriesArr[key] = `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(query[key])}&start=${encodeURIComponent(startTime)}&end=${encodeURIComponent(endTime)}&step=3600s`;
  }

  // console.log("exited for loop")
  res.locals.errorRateQueries=queriesArr;
  console.log(res.locals.errorRateQueries)
  return next()
};


export const queryForErrors = async (req, res, next) => {};
