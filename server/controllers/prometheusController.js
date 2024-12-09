import fetch from "node-fetch";

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

// historical data
// GET /api/v1/query_range?
//   query=sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)&
//   start=2023-10-01T00:00:00Z&
//   end=2023-10-01T01:00:00Z&
//   step=30s
