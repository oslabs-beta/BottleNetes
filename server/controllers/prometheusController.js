import fetch from "node-fetch";

export const runSinglePromQLQuery = async (req, res, next) => {
  const queryStr = res.locals.query;
  let queryUrl;
  if (res.locals.isHistorical) {
    queryUrl = `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(
      queryStr,
    )}&start=${res.locals.timeStart}&end=${res.locals.timeEnd}&step=${res.locals.timeStep}`;
  } else {
    queryUrl = `http://localhost:9090/api/v1/query?query=${encodeURIComponent(
      queryStr,
    )}`;
  }

  try {
    const response = await fetch(queryUrl);
    const data = await response.json();
    res.locals.data = data.data.result;
    console.log("queryUrl", queryUrl);
    return next();
  } catch (error) {
    return next({
      log: "Error in runPromQLQuery middleware" + error,
      status: 500,
      message: { err: "An error occurred" },
    });
  }
};

export const runMultiplePromQLQueries = async (req, res, next) => {
  const queryStrArr = res.locals.queries;
  const queryUrlArr = [];

  for (const queryStr of queryStrArr) {
    let queryUrl;
    if (res.locals.isHistorical) {
      queryUrl = `http://localhost:9090/api/v1/query_range?query=${encodeURIComponent(
        queryStr,
      )}&start=${res.locals.timeStart}&end=${res.locals.timeEnd}&step=${res.locals.timeStep}`;
    } else {
      queryUrl = `http://localhost:9090/api/v1/query?query=${encodeURIComponent(
        queryStr,
      )}`;
    }
    queryUrlArr.push(queryUrl);
  }
  console.log("queryUrlArr: ", queryUrlArr);

  res.locals.data = [];
  for (const queryUrl of queryUrlArr) {
    try {
      const response = await fetch(queryUrl);
      const data = await response.json();
      res.locals.data.push(data.data.result);
      console.log("\nfetched data from query url: ", queryUrl);
    } catch (error) {
      return next({
        log: "Error in runMultiplePromQLQueries middleware" + error,
        status: 500,
        message: { err: "An error occurred" },
      });
    }
  }
  return next();
};

// historical data (use query_range)
// GET /api/v1/query_range?
//   query=sum(rate(container_cpu_usage_seconds_total[5m])) by (pod)&
//   start=2023-10-01T00:00:00Z&
//   end=2023-10-01T01:00:00Z&
//   step=30s

// get the status of all pods (e.g. phase: Pending, Running, Succeeded)
// kube_pod_status_phase == 1

// get the readiness of all pods (e.g. condition: true, false)
// kube_pod_status_ready == 1

// get the restart count of all pods
// kube_pod_container_status_restarts_total

// get the container info of all pods (e.g. container name, image, etc.)
// kube_pod_container_info

// cpu and memory request of each pod
// kube_pod_container_resource_requests{resource="cpu"}
// kube_pod_container_resource_requests{resource="memory"}

// cpu and memory limit of each pod
// kube_pod_container_resource_limits{resource="cpu"}
// kube_pod_container_resource_limits{resource="memory"}

// cpu usage request vs. limit percentage of each pod (realtime, in %)
// ( sum by (pod)(kube_pod_container_resource_requests{resource="cpu"}) )
// /
// ( sum by (pod)(kube_pod_container_resource_limits{resource="cpu"}) )
// * 100

// memory usage request vs. limit percentage of each pod (realtime, in %)
// ( sum by (pod)(kube_pod_container_resource_requests{resource="memory"}) )
// /
// ( sum by (pod)(kube_pod_container_resource_limits{resource="memory"}) )
// * 100

// memory usage of each pod (real-time, in bytes)
// container_memory_usage_bytes

// cumulative cpu usage of each pod (in CPU seconds)
// container_cpu_usage_seconds_total

// memory usage of the pod as a percentage of the pod's memory requests (real-time, in %)
// ( sum by (pod) (container_memory_usage_bytes) )
// /
// ( sum by (pod) (kube_pod_container_resource_requests{resource="memory"}) )
// * 100

// memory usage of the pod as a percentage of the pod's memory requests (over a time window, in %)
// ( sum by (pod)(avg_over_time(container_memory_usage_bytes[1m])) )
// /
// ( sum by (pod)(kube_pod_container_resource_requests{resource="memory"}) )
// * 100

//  CPU usage of the pod as a percentage of the pod's CPU requests (over a time window, in %)
// ( sum by (pod) (rate(container_cpu_usage_seconds_total[1m])) )
// /
// ( sum by (pod) (kube_pod_container_resource_requests{resource="cpu"}) )
// * 100
