/**
 * Hooks run when fetching data to display in the Main Page
 */

import { useState, useEffect } from "react";

const useFetchData = ({
  backendUrl,
  refreshFrequency,
  queryTimeWindow,
  podRestartCount,
  manualRefreshCount,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [allData, setAllData] = useState({
    podsStatuses: { podsStatuses: [] },
    requestLimits: { allPodsRequestLimit: [] },
    allNodes: { allNodes: [] },
    cpuUsageOneValue: { resourceUsageOneValue: [] },
    memoryUsageOneValue: { resourceUsageOneValue: [] },
    cpuUsageHistorical: null,
    memoryUsageHistorical: null,
    latencyAppRequestOneValue: { latencyAppRequestOneValue: [] },
  });

  useEffect(() => {
    const fetchData = async (method, endpoint, body = null) => {
      try {
        const request = {
          method: method,
          headers: { "Content-Type": "application/json" },
        };
        if (body) request.body = JSON.stringify(body);
        const response = await fetch(backendUrl + endpoint, request);
        return await response.json();
      } catch (error) {
        console.error("Fetch error:", error);
        return null;
      }
    };

    const bigFetch = async () => {
      setIsLoading(true);
      console.log("Fetching data...");

      const metricsConfig = {
        bodyResourceUsageOnevalueCPU: {
          type: "cpu",
          time: queryTimeWindow,
          level: "pod",
        },
        bodyResourceUsageOnevalueMemory: {
          type: "memory",
          time: queryTimeWindow,
          level: "pod",
        },
        bodyResourceUsageHistorical: {
          timeEnd: Math.floor(Date.now() / 1000).toString(),
          timeStart: (Math.floor(Date.now() / 1000) - 86400).toString(),
          timeStep: "60",
          level: "pod",
        },
        bodyLatencyAppRequestOneValue: {
          time: queryTimeWindow,
          level: "pod",
        },
      };

      try {
        const [
          status,
          requestLimits,
          cpuUsageOneValue,
          memoryUsageOneValue,
          cpuUsageHistorical,
          memoryUsageHistorical,
          latencyAppRequestOneValue,
          latencyAppRequestHistorical,
        ] = await Promise.all([
          fetchData("GET", "api/all-pods-status"),
          fetchData("GET", "api/all-pods-request-limit"),
          fetchData(
            "POST",
            "api/resource-usage-onevalue",
            metricsConfig.bodyResourceUsageOnevalueCPU,
          ),
          fetchData(
            "POST",
            "api/resource-usage-onevalue",
            metricsConfig.bodyResourceUsageOnevalueMemory,
          ),
          fetchData("POST", "api/resource-usage-historical", {
            ...metricsConfig.bodyResourceUsageHistorical,
            type: "cpu",
          }),
          fetchData("POST", "api/resource-usage-historical", {
            ...metricsConfig.bodyResourceUsageHistorical,
            type: "memory",
          }),
          fetchData(
            "POST",
            "api/latency-app-request-onevalue",
            metricsConfig.bodyLatencyAppRequestOneValue,
          ),
          fetchData(
            "POST",
            "api/latency-app-request-historical",
            metricsConfig.bodyResourceUsageHistorical,
          ),
        ]);

        setAllData({
          podsStatuses: status || [],
          requestLimits: requestLimits || [],
          allNodes: {
            allNodes: [{ nodeName: "Minikube", clusterName: "Minikube" }],
          },
          cpuUsageOneValue: cpuUsageOneValue || [],
          memoryUsageOneValue: memoryUsageOneValue || [],
          cpuUsageHistorical: cpuUsageHistorical || [],
          memoryUsageHistorical: memoryUsageHistorical || [],
          latencyAppRequestOneValue: latencyAppRequestOneValue || [],
          latencyAppRequestHistorical: latencyAppRequestHistorical || [],
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    bigFetch(); // initial fetch

    const intervalID = setInterval(bigFetch, refreshFrequency); // refreshFrequency is in ms!
    return () => clearInterval(intervalID);
  }, [
    refreshFrequency,
    manualRefreshCount,
    queryTimeWindow,
    podRestartCount,
    backendUrl,
  ]);

  return { isLoading, allData };
};

export default useFetchData;
