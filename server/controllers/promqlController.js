const parseTime = (time) => {
  const timeRegex = /^(\d+)(s|m|h|d)$/;
  const match = time.match(timeRegex);
  if (!match) {
    throw new Error("Invalid time format. Use format: {number}s|m|h|d");
  }
  return time;
};

export const generateAllPodsStatusQuery = async (req, res, next) => {
  const query1 = "kube_pod_status_phase == 1";
  const query2 = "kube_pod_status_ready == 1";
  const query3 = "kube_pod_container_info";
  const query4 = "kube_pod_container_status_restarts_total";
  const query5 = "kube_pod_info == 1";
  res.locals.queries = [query1, query2, query3, query4, query5];
  return next();
};

export const generateAllPodsRequestLimitQuery = async (req, res, next) => {
  const query1 = `kube_pod_container_resource_requests{resource="cpu"}`;
  const query2 = `kube_pod_container_resource_requests{resource="memory"}`;
  const query3 = `kube_pod_container_resource_limits{resource="cpu"}`;
  const query4 = `kube_pod_container_resource_limits{resource="memory"}`;
  const query5 = `
  ( sum by (pod)(kube_pod_container_resource_requests{resource="cpu"}) )
  /
  ( sum by (pod)(kube_pod_container_resource_limits{resource="cpu"}) )
  * 100`;
  const query6 = `
  ( sum by (pod)(kube_pod_container_resource_requests{resource="memory"}) )
  /
  ( sum by (pod)(kube_pod_container_resource_limits{resource="memory"}) )
  * 100`;
  res.locals.queries = [query1, query2, query3, query4, query5, query6];
  return next();
};
