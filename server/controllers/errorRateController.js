import fetch from "node-fetch";

export const generateErrorQuery = async (req, res, next) => {
  console.log("We're in generate error query middleware");
  console.log(req.body);
  const { query } = req.body;
  console.log(query);
  res.locals.queryString = "";
  
  ('http://<prometheus-server>/api/v1/query_range?query=count_over_time(kubernetes_events{reason="OOMKilled", node="your-node-name"}[1h])&start=<start-time>&end=<end-time>&step=3600');
  const url = `http://localhost:9090/api/v1/query?query=${encodeURIComponent(
    queryStr,
  )}`;
  return next();
};

export const queryForErrors = async (req, res, next) => {};
