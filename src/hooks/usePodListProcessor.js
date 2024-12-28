/**
 * Hook to memoize pod data
 */

import { useMemo } from "react";

const usePodListProcessor = ({
  podStatuses,
  cpuUsageOneValue,
  memoryUsageOneValue,
  latencyAppRequestOneValue,
  selectedMetric,
  filterConfig,
  metricToSort,
  defaultView,
}) => {
  // useMemo is used to optimize performance by memoizing the result of a function so that the function does not have to recompute the result every time it is called with the same inputs.
  // In this case, the usePodListProcessor hook is memoized so that the result of the hook is cached and returned when the hook is called with the same inputs.
  // This can help improve performance by avoiding unnecessary re-renders when the inputs to the hook have not changed.
  return useMemo(() => {
    // Early return if no pod status data
    if (!podStatuses?.allPodsStatus) {
      return [];
    }

    const podList = podStatuses.allPodsStatus.map((pod) => {
      // Base pod object with static properties
      const podObj = {
        podName: pod.podName,
        namespace: pod.namespace,
        status: pod.status,
        readiness: pod.readiness,
        containers: pod.containers,
        service: pod.service,
        deploymentName: pod.deploymentName,
        selectedMetric,
      };

      // CPU metrics
      const cpuData = cpuUsageOneValue?.resourceUsageOneValue?.find(
        (obj) => obj.name === pod.podName,
      );
      podObj.cpuDataRelative = cpuData?.usageRelativeToRequest;
      podObj.cpuDataAbsolute = cpuData?.usageAbsolute;

      // Memory metrics
      const memoryData = memoryUsageOneValue?.resourceUsageOneValue?.find(
        (obj) => obj.name === pod.podName,
      );
      podObj.memoryDataRelative = memoryData?.usageRelativeToRequest;
      podObj.memoryDataAbsolute = memoryData?.usageAbsolute;

      // Latency metrics
      const latencyData =
        latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
          (obj) => obj.name === pod.podName,
        );
      podObj.latencyData = latencyData?.avgCombinedLatency;

      return podObj;
    });

    // e.g.
    // podList: [
    //   {
    //     podName: "pod1",
    //     namespace: "namespace1",
    //     status: "Running",
    //     readiness: true,
    //     containers: ["container1", "container2"],
    //     service: "service1",
    //     cpuDataRelative: 0.5,
    //     cpuDataAbsolute: 500,
    //     memoryDataRelative: 0.3,
    //     memoryDataAbsolute: 300,
    //     latencyData: 0.1,
    //     deploymentName: "deployment1",
    //     selectedMetric: "cpu",
    //   },
    // ];

    // create a copy of the pod list to avoid mutating the original data
    let processedPods = [...podList];

    // Apply filtering if configured and not in default view
    if (filterConfig.type && filterConfig.value && !defaultView) {
      processedPods = processedPods.filter((pod) => {
        // if (["cpuRelative", "memoryRelative"].includes(filterConfig.type)) {
        //   const value = pod[filterConfig.type];
        //   const threshold = parseFloat(filterConfig.value);
        //   return filterConfig.operator === "over"
        //     ? value > threshold
        //     : value < threshold;
        // }
        return pod[filterConfig.type] === filterConfig.value;
      });
    }

    // Apply sorting if metric is selected and not in default view
    if (metricToSort && !defaultView) {
      processedPods.sort(
        // when metric data is not available, default to 0
        (a, b) => (b[metricToSort] || 0) - (a[metricToSort] || 0),
      );
    }

    return processedPods;
  }, [
    podStatuses,
    cpuUsageOneValue,
    memoryUsageOneValue,
    latencyAppRequestOneValue,
    selectedMetric,
    filterConfig,
    metricToSort,
    defaultView,
  ]);
};

export default usePodListProcessor;
