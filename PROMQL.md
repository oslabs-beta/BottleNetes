# CPU Usage Queries in Prometheus Query Language (PromQL)

---

### Table of Queries

| **Query Number** | **Query**                                                                                                                              | **Description**                                                        | **Detailed Explanation**                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1                | `container_cpu_usage_seconds_total`                                                                                                    | Total cumulative CPU time consumed by containers.                      | This metric represents the total amount of CPU time (in seconds) that each container has used since it started. It is a counter metric that only increases over time. The data is collected by cAdvisor and exposed by Prometheus. Labels like `container`, `pod`, and `namespace` help identify which container or pod the metric refers to.                                                                                                              |
| 2                | `rate(container_cpu_usage_seconds_total[5m])`                                                                                          | Per-second average CPU usage rate over the last 5 minutes.             | The `rate()` function calculates the average rate of change per second of a counter metric over a specified time range. Here, it computes how quickly the CPU usage is increasing per second for each container, effectively giving you the current CPU usage rate. The result is in CPU seconds per second, which simplifies to CPU cores used.                                                                                                           |
| 3                | `avg(rate(container_cpu_usage_seconds_total[5m])) by (pod)`                                                                            | Average CPU usage rate per pod over the last 5 minutes.                | This query calculates the average CPU usage rate for each pod by averaging the CPU usage rates of all containers within each pod. The `avg()` function computes the mean, and `by (pod)` groups the data by the `pod` label. This helps you see how much CPU each pod is using on average.                                                                                                                                                                 |
| 4                | `avg(rate(container_cpu_usage_seconds_total[5m])) by (pod) / sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod) * 100` | Percentage of CPU requests being used per pod over the last 5 minutes. | This query calculates how much of the requested CPU resources each pod is actually using. The numerator `avg(rate(...)) by (pod)` gives the average CPU usage per pod, while the denominator `sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod)` provides the total CPU resources requested by each pod. Dividing the usage by the request and multiplying by 100 gives you the CPU usage as a percentage of the requested CPU resources. |
| 5                | `kube_pod_container_resource_requests{resource="cpu"}`                                                                                 | CPU resource requests for each container.                              | This metric shows the amount of CPU resources that each container has requested. The filter `{resource="cpu"}` ensures that only CPU resource requests are selected. This information is useful for understanding the resource guarantees that have been set for each container.                                                                                                                                                                           |
| 6                | `sum(kube_pod_container_resource_requests{resource="cpu"}) by (pod) * 100`                                                             | Total CPU resource requests per pod, scaled by 100.                    | This query sums up the CPU requests of all containers within each pod using `sum(... by (pod))`. Multiplying by 100 scales the values, which is often done when calculating percentages. However, without dividing by actual usage, this alone doesn't provide a percentage—it just scales the total requested CPU resources per pod.                                                                                                                      |
| 7                | `node_cpu_seconds_total`                                                                                                               | Total cumulative CPU time consumed by the node.                        | Similar to `container_cpu_usage_seconds_total`, but at the node level. This metric represents the total CPU time (in seconds) that the node's CPUs have spent in various modes (e.g., `user`, `system`, `idle`) since the node started. It includes labels like `mode` (indicating the type of CPU activity) and `cpu` (the CPU core number).                                                                                                              |
| 8                | `node_cpu_seconds_total[5m]`                                                                                                           | Node CPU time data over the last 5 minutes.                            | This query selects all samples of `node_cpu_seconds_total` within the last 5 minutes using `[5m]`. It's a range vector that provides a time window of data for calculations. This is useful when you want to compute the CPU usage rate of the node over a recent time period.                                                                                                                                                                             |

---

### Additional Explanations

#### Counter Metrics

Metrics like `container_cpu_usage_seconds_total` and `node_cpu_seconds_total` are counters, meaning they continuously increase over time. They represent cumulative values since the start time.

#### Range Vectors (`[5m]`)

Adding `[5m]` after a metric turns it into a range vector, which includes all the metric samples within the last 5 minutes. This is required for functions like `rate()` that operate over a time range.

#### `rate()` Function

The `rate()` function calculates the average rate of increase per second of a counter metric over the specified time range. It effectively converts cumulative metrics into instantaneous rates.

#### Aggregation Functions

- **`avg()`**: Computes the average of the values.
- **`sum()`**: Adds up all the values.
- **`by (label)`**: Groups the data by the specified label(s), performing the aggregation within each group.

#### Calculating Percentages

In Query 4, dividing the current usage by the requested resources and multiplying by 100 gives you the usage as a percentage of the requests. This helps in assessing whether pods are underutilizing or overutilizing their requested CPU resources.

#### Resource Requests

The `kube_pod_container_resource_requests` metric provides the amount of CPU (or memory) that containers have requested. Kubernetes uses these requests for scheduling decisions and to ensure that pods have the resources they need.

---

### Understanding the Differences Among the Queries

- **Raw Metrics vs. Calculations**: Queries 1, 5, and 7 provide raw cumulative metrics. Queries 2, 3, 4, and 6 perform calculations on these metrics to derive rates, averages, or percentages.
- **Time Range Selection**: Queries with `[5m]` select data over the last 5 minutes, allowing for rate calculations and smoothing out short-term fluctuations.
- **Level of Aggregation**: Some queries focus on individual containers (e.g., Query 1), while others aggregate data at the pod level (e.g., Query 3 and 4) or node level (e.g., Query 7).
- **Usage vs. Requests**: Queries 1-4 deal with actual CPU usage, while Queries 5 and 6 deal with CPU resource requests made by containers or pods.
- **Purpose of Each Query**:
  - **Queries 1-4**: Monitor CPU usage and performance.
  - **Query 4**: Assess how efficiently pods are using their allocated CPU resources.
  - **Queries 5-6**: Understand resource allocation and scheduling.
  - **Queries 7-8**: Monitor overall node performance and CPU utilization.
