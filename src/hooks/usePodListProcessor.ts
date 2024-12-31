/**
 * Hook to memoize pod data
 */

import { useMemo } from "react";

import dataStore from "../stores/dataStore.ts";
import mainStore from "../stores/mainStore.ts";

type podObj = {
  podName: string;
  namespace: string;
  status: string;
  readiness: boolean;
  containers: any[];
  service: string;
  deploymentName: string;
  selectedMetric: "cpu" | "memory" | "latency";
  cpuDataRelative?: number;
  cpuDataAbsolute?: number;
  memoryDataRelative?: number;
  memoryDataAbsolute?: number;
  cpuRequest?: number | null;
  cpuLimit?: number | null;
  memoryRequest?: number | null;
  memoryLimit?: number | null;
  latencyData?: number;
  [key: string]:
    | string
    | number
    | boolean
    | any[]
    | Record<string, unknown>
    | null
    | undefined;
};

const usePodListProcessor = () => {
  const { filterConfig, metricToSort } = dataStore();
  const { selectedMetric, defaultView } = mainStore();
  const podStatuses = dataStore((state) => state.allData.podsStatuses);
  const cpuUsageOneValue = dataStore((state) => state.allData.cpuUsageOneValue);
  const memoryUsageOneValue = dataStore(
    (state) => state.allData.memoryUsageOneValue,
  );
  const latencyAppRequestOneValue = dataStore(
    (state) => state.allData.latencyAppRequestOneValue,
  );
  const requestLimits = dataStore((state) => state.allData.requestLimits);
  // useMemo is used to optimize performance by memoizing the result of a function so that the function does not have to recompute the result every time it is called with the same inputs.
  // In this case, the usePodListProcessor hook is memoized so that the result of the hook is cached and returned when the hook is called with the same inputs.
  // This can help improve performance by avoiding unnecessary re-renders when the inputs to the hook have not changed.
  return useMemo(() => {
    // Early return if no pod status data
    if (Array.isArray(podStatuses) || !podStatuses?.allPodsStatus) {
      return [];
    }

    const podList = podStatuses.allPodsStatus.map((pod) => {
      // Base pod object with static properties
      const podObj: podObj = {
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
      const cpuData = Array.isArray(cpuUsageOneValue)
        ? undefined
        : cpuUsageOneValue?.resourceUsageOneValue?.find(
            (obj) => obj.name === pod.podName,
          );
      podObj.cpuDataRelative = cpuData?.usageRelativeToRequest;
      podObj.cpuDataAbsolute = cpuData?.usageAbsolute;

      // Memory metrics
      const memoryData = Array.isArray(memoryUsageOneValue)
        ? undefined
        : memoryUsageOneValue?.resourceUsageOneValue?.find(
            (obj) => obj.name === pod.podName,
          );
      podObj.memoryDataRelative = memoryData?.usageRelativeToRequest;
      podObj.memoryDataAbsolute = memoryData?.usageAbsolute;

      // Request and Limits data
      const requestLimit = Array.isArray(requestLimits)
        ? undefined
        : requestLimits?.allPodsRequestLimit?.find(
            (obj) => obj.podName === pod.podName,
          );
      podObj.cpuRequest = requestLimit?.cpuRequest || null;
      podObj.cpuLimit = requestLimit?.cpuLimit || null;
      podObj.memoryRequest = requestLimit?.memoryRequest
        ? requestLimit.memoryRequest / (1024 * 1024)
        : null;
      podObj.memoryLimit = requestLimit?.memoryLimit
        ? requestLimit.memoryLimit / (1024 * 1024)
        : null;

      // Latency metrics
      const latencyData = Array.isArray(latencyAppRequestOneValue)
        ? undefined
        : latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
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
        // will add this back when implementing filtering by metric threshold values
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
      processedPods.sort((a, b) => {
        if (metricToSort === "podName") {
          // when sorting by pod name, use localeCompare method for string comparison
          return typeof a[metricToSort] === "string" &&
            typeof b[metricToSort] === "string"
            ? a[metricToSort].localeCompare(b[metricToSort])
            : 0;
        }
        // when sorting by other metrics, use numeric comparison,
        // if the metric is not available, default to 0
        return (Number(b[metricToSort]) || 0) - (Number(a[metricToSort]) || 0);
      });
    }

    return processedPods;
  }, [
    podStatuses,
    cpuUsageOneValue,
    memoryUsageOneValue,
    latencyAppRequestOneValue,
    requestLimits,
    selectedMetric,
    filterConfig,
    metricToSort,
    defaultView,
  ]);
};

export default usePodListProcessor;
