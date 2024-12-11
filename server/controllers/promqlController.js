export const generateQueryAllPodsStatus = async (req, res, next) => {
  const query1 = "kube_pod_status_phase == 1";
  const query2 = "kube_pod_status_ready == 1";
  const query3 = "kube_pod_container_info";
  const query4 = "kube_pod_container_status_restarts_total";
  const query5 = "kube_pod_info == 1";
  res.locals.queries = [query1, query2, query3, query4, query5];
  return next();
};

export const generateQueryAllPodsRequestLimit = async (req, res, next) => {
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

export const generateQueryResourceUsage = async (req, res, next) => {
  const { type, timeWindow, level } = res.locals;

  if (type === "memory") {
    const relativeQuery = `
      ( sum by (${level})(avg_over_time(container_memory_usage_bytes[${timeWindow}])) )
      /
      ( sum by (${level})(kube_pod_container_resource_requests{resource="memory"}) )
      * 100
    `;

    const absoluteQuery = `
      sum by (${level})(avg_over_time(container_memory_usage_bytes[${timeWindow}]))
    `;

    res.locals.queries = [relativeQuery, absoluteQuery];
  }

  if (type === "cpu") {
    const relativeQuery = `
      ( sum by (${level}) (rate(container_cpu_usage_seconds_total[${timeWindow}])) )
      /
      ( sum by (${level}) (kube_pod_container_resource_requests{resource="cpu"}) )
      * 100
    `;

    const absoluteQuery = `
      sum by (${level}) (rate(container_cpu_usage_seconds_total[${timeWindow}]))
    `;

    res.locals.queries = [relativeQuery, absoluteQuery];
  }

  return next();
};

export const generateQueryLatencyAppRequest = async (req, res, next) => {
  const { timeWindow, level } = res.locals;

  // Total Number of Requests (inbound + outbound traffic) per pod
  const query1 = `
    sum by (${level}) (increase(istio_request_duration_milliseconds_count{reporter="destination"}[${timeWindow}]))
    +
    sum by (${level}) (increase(istio_request_duration_milliseconds_count{reporter="source"}[${timeWindow}]))
  `;
  // inbound request latency
  const query2 = `
    sum by (${level}) (rate(istio_request_duration_milliseconds_sum{reporter="destination"}[${timeWindow}]))
    /
    sum by (${level}) (rate(istio_request_duration_milliseconds_count{reporter="destination"}[${timeWindow}]))
  `;

  // outbound request latency
  const query3 = `
    sum by (${level}) (rate(istio_request_duration_milliseconds_sum{reporter="source"}[${timeWindow}]))
    /
    sum by (${level}) (rate(istio_request_duration_milliseconds_count{reporter="source"}[${timeWindow}]))
  `;

  // inbound + outbound request latency
  const query4 = `
    (
      sum by (${level}) (rate(istio_request_duration_milliseconds_sum{reporter="destination"}[${timeWindow}]))
      +
      sum by (${level}) (rate(istio_request_duration_milliseconds_sum{reporter="source"}[${timeWindow}]))
    ) / (
      sum by (${level}) (rate(istio_request_duration_milliseconds_count{reporter="destination"}[${timeWindow}]))
      +
      sum by (${level}) (rate(istio_request_duration_milliseconds_count{reporter="source"}[${timeWindow}]))
    )
  `;

  // 99th percentile peak latency for inbound requests
  const query5 = `
    histogram_quantile(
      0.99,
      sum(
        rate(
          istio_request_duration_milliseconds_bucket{reporter="destination"}[${timeWindow}]
        )
      ) by (le, ${level})
    )
  `;

  // 99th percentile peak latency for outbound requests
  const query6 = `
    histogram_quantile(
      0.99,
      sum(
        rate(
          istio_request_duration_milliseconds_bucket{reporter="source"}[${timeWindow}]
        )
      ) by (le, ${level})
    )
  `;

  res.locals.queries = [query1, query2, query3, query4, query5, query6];

  return next();
};
