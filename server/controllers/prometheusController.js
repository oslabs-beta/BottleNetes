/**
 * Controller contains:
 * runSinglePromQLQuery: process single query
 * runMultiplePromQLQueries: process multiple queries in the array
 */
import axios from "axios";
//import fetch from "node-fetch";

export const fetchPromQLData = async () => {
  try {
    const prometheusUrl = process.env.PROMETHEUS_URL;

    const queries = {
      podStatuses: "kube_pod_status_phase == 1",
      cpuUsage: "container_cpu_usage_seconds_total",
      memoryUsage: "container_memory_usage_bytes",
      latency: "istio_request_duration_milliseconds_sum",
    };

    const results = {};
    for (const [key, query] of Object.entries(queries)) {
      const response = await axios.get(`${prometheusUrl}/api/v1/query`, {
        params: { query },
      });
      results[key] = response.data.data.result;
    }

    return results;
  } catch (error) {
    console.error("❌ Error fetching PromQL data:", error.message);
    throw new Error("Failed to fetch PromQL data.");
  }
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
