/**
 * API Documentation for /query endpoint
 *
 * Request Body Schema:
 * {
 *   type: string,      // Required. Options: "cpu" | "memory"
 *   time: string,      // Required. Format: "{number}s" | "{number}m" | "{number}h"
 *                      // Examples: "15s", "5m", "1h"
 *   aggregation: string //  Options: "avg" | "sum" | "max" | "min"
 *      level: string       // Required. Options: "pod, namespace" | "namespace" | "pod" | "cluster"
 * }
 *
 * Example Requests:
 * 1. average CPU usage over last 5 minutes per pod:
 *    {
 *      "type": "cpu",
 *      "time": "5m",
 *     "aggregation": "avg",
 *     "level": "pod"
 *    }
 *
 * 2. Average memory utilization over last hour per pod:
 *    {
 *      "type": "memory",
 *      "time": "1h",
 *      "aggregation": "avg",
 *      "level": "pod"
 *    }
 */

const parseTime = (time) => {
  const timeRegex = /^(\d+)(s|m|h|d)$/;
  const match = time.match(timeRegex);
  if (!match) {
    throw new Error("Invalid time format. Use format: {number}s|m|h|d");
  }
  return time;
};

const getCPUQuery = (timeWindow, aggregationType, level) => {
  return `
    ${aggregationType}(rate(container_cpu_usage_seconds_total[${timeWindow}])) by (${level}) /
    sum(kube_pod_container_resource_requests{resource="cpu"}) by (${level}) * 100
  `;
};

const getMemoryQuery = (timeWindow, aggregationType, level) => {
  return `
    ${aggregationType}(avg_over_time(container_memory_usage_bytes[${timeWindow}])) by (${level}) /
    sum(kube_pod_container_resource_requests{resource="memory"}) by (${level}) * 100
  `;
};

export const generateQuery = async (req, res, next) => {
  if (!req.body.type || !req.body.time || !req.body.level) {
    return next({
      log: "Error in generateQuery middleware",
      status: 400,
      message: { err: "Invalid request, not enough data are provided" },
    });
  }

  const { type, time, aggregation, level } = req.body;

  try {
    const timeWindow = parseTime(time);

    switch (type) {
      case "cpu":
        res.locals.query = getCPUQuery(timeWindow, aggregation, level);
        break;
      case "memory":
        res.locals.query = getMemoryQuery(timeWindow, aggregation, level);
        break;
      default:
        return next({
          log: "Error in generateQuery middleware",
          status: 400,
          message: { err: "Invalid request type" },
        });
    }
    console.log("Query generated:", res.locals.query);
    return next();
  } catch (error) {
    return next({
      log: `Error generating query: ${error}`,
      status: 400,
      message: { err: error.message },
    });
  }
};
