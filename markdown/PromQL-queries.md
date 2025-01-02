# PromQL Metrics and Queries for Kubernetes Monitoring

This document provides the PromQL queries used in Bottlenetes for monitoring various aspects of Kubernetes clusters. Each query is explained with its purpose, the metric it retrieves, and its potential applications.

## Pod Status

### 1. Pod Phase

**Query:** `kube_pod_status_phase == 1`

**Purpose:** Retrieves the current phase of each pod. Phases include:

- **Pending:** Pod has been accepted by the cluster but is not yet running.
- **Running:** Pod is executing and operational.
- **Succeeded:** All containers in the pod have completed successfully.

**Use Case:** Monitor the lifecycle state of pods to ensure smooth deployment and execution.

---

### 2. Pod Readiness

**Query:** `kube_pod_status_ready == 1`

**Purpose:** Determines the readiness condition of each pod. Values:

- **True:** Pod is ready to serve requests.
- **False:** Pod is not ready.

**Use Case:** Identify pods ready to handle traffic and those needing attention.

---

### 3. Pod Container Info

**Query:** `kube_pod_container_info`

**Purpose:** Provides detailed information about each pod's containers, including:

- Container name
- Image name

**Use Case:** Useful for debugging and verifying container configurations.

---

### 4. Deployment Information

**Query:** `kube_replicaset_owner{owner_kind="Deployment"}`

**Purpose:** Retrieves deployment details for each pod, such as the associated owner name (e.g., `demo-app-frontend-deployment`).

**Use Case:** Link pods to their respective deployments to ensure consistency and traceability.

---

### 5. Container Restart Count

**Query:** `kube_pod_container_status_restarts_total`

**Purpose:** Tracks the total number of container restarts for each pod.

**Use Case:** Identify unstable pods experiencing frequent restarts to pinpoint potential issues.

## Resource Requests and Limits

### 1. CPU Requests

**Query:** `kube_pod_container_resource_requests{resource="cpu"}`

**Purpose:** Retrieves the CPU resources requested by each pod.

**Use Case:** Ensure requested resources match expected requirements for optimal performance.

---

### 2. Memory Requests

**Query:** `kube_pod_container_resource_requests{resource="memory"}`

**Purpose:** Fetches the memory resources requested by each pod.

**Use Case:** Prevent resource contention by monitoring memory allocation.

---

### 3. CPU Limits

**Query:** `kube_pod_container_resource_limits{resource="cpu"}`

**Purpose:** Retrieves the CPU resource limits set for each pod.

**Use Case:** Monitor resource caps to prevent excessive usage by pods.

---

### 4. Memory Limits

**Query:** `kube_pod_container_resource_limits{resource="memory"}`

**Purpose:** Fetches the memory limits configured for each pod.

**Use Case:** Ensure pods operate within defined boundaries to avoid cluster instability.

---

### 5. CPU Usage vs. Limit Percentage

**Query:**

```
( sum by (pod)(kube_pod_container_resource_requests{resource="cpu"}) ) /
( sum by (pod)(kube_pod_container_resource_limits{resource="cpu"}) ) * 100
```

**Purpose:** Calculates the percentage of requested CPU resources relative to limits for each pod.

**Use Case:** Monitor how efficiently pods use their allocated CPU resources.

---

### 6. Memory Usage vs. Limit Percentage

**Query:**

```
( sum by (pod)(kube_pod_container_resource_requests{resource="memory"}) ) /
( sum by (pod)(kube_pod_container_resource_limits{resource="memory"}) ) * 100
```

**Purpose:** Determines the memory request-to-limit ratio for each pod.

**Use Case:** Identify pods approaching or exceeding their memory limits.

---

### 7. CPU Overcommit

**Query:** `sum(kube_pod_container_resource_limits{resource="cpu"}) - sum(kube_node_status_capacity_cpu_cores)`

**Purpose:** Calculates the overcommitment of CPU resources across the cluster.

**Use Case:** Ensure the cluster's CPU capacity is not excessively overcommitted.

---

### 8. Memory Overcommit

**Query:** `sum(kube_pod_container_resource_limits{resource="memory"}) - sum(kube_node_status_capacity_memory_bytes)`

**Purpose:** Computes the memory overcommitment across the cluster.

**Use Case:** Maintain balanced resource allocation to prevent memory contention.

## Usage Metrics

### 1. Memory Usage

**Query:** `container_memory_usage_bytes`

**Purpose:** Tracks the actual memory usage of each pod.

**Use Case:** Ensure memory usage stays within acceptable thresholds.

---

### 2. CPU Usage

**Query:** `container_cpu_usage_seconds_total`

**Purpose:** Measures the cumulative CPU usage of each pod over time.

**Use Case:** Analyze trends in CPU consumption for performance tuning.

---

### 3. Memory Usage Percentage

**Query:**

```
( sum by (pod) (container_memory_usage_bytes) ) /
( sum by (pod) (kube_pod_container_resource_requests{resource="memory"}) ) * 100
```

**Purpose:** Calculates memory usage as a percentage of the requested memory resources.

**Use Case:** Monitor efficiency and optimize memory allocations.

---

### 4. CPU Usage Percentage Over Time

**Query:**

```
( sum by (pod) (rate(container_cpu_usage_seconds_total[1m])) ) /
( sum by (pod) (kube_pod_container_resource_requests{resource="cpu"}) ) * 100
```

**Purpose:** Evaluates CPU usage as a percentage of requested CPU resources over a time window.

**Use Case:** Identify CPU usage spikes and optimize resource requests.

## Traffic Metrics

### 1. Total Requests Per Pod

**Query:**

```
sum(increase(istio_request_duration_milliseconds_count{reporter="destination"}[1h])) by (pod) +

sum(increase(istio_request_duration_milliseconds_count{reporter="source"}[1h])) by (pod)
```

**Purpose:** Measures the total number of inbound and outbound requests for each pod.

**Use Case:** Track traffic patterns to identify bottlenecks or anomalies.

---

### 2. Inbound Requests Per Pod

**Query:**

```
sum(increase(istio_request_duration_milliseconds_count{reporter="destination"}[1h])) by (pod)
```

**Purpose:** Counts the total inbound requests for each pod.

**Use Case:** Ensure load distribution across pods.

---

### 3. Outbound Requests Per Pod

**Query:**

```
sum(increase(istio_request_duration_milliseconds_count{reporter="source"}[1h])) by (pod)
```

**Purpose:** Counts the total outbound requests for each pod.

**Use Case:** Monitor outgoing traffic to identify excessive external calls.

---

### 4. Average Latency Per Pod

**Query:**

```
sum(rate(istio_request_duration_milliseconds_sum{reporter="destination"}[1h])) by (pod) /

sum(rate(istio_request_duration_milliseconds_count{reporter="destination"}[1h])) by (pod)
```

**Purpose:** Calculates the average latency for inbound traffic per pod.

**Use Case:** Measure response times to optimize performance.

---

### 5. Peak Latency Per Pod

**Query:**

```
histogram_quantile(
  0.99,
  sum(
    rate(
      istio_request_duration_milliseconds_bucket{reporter="destination"}[1h]
    )
  ) by (le, pod)
)
```

**Purpose:** Identifies the 99th percentile latency for outbound traffic per pod.

**Use Case:** Detect latency spikes and mitigate performance issues.

---

This document serves as a reference for the PromQL queries used in Bottlenetes for Kubernetes monitoring. By leveraging these queries, you can gain valuable insights into your cluster's health, resource utilization, and performance metrics.
