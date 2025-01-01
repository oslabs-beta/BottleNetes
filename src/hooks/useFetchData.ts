/**
 * Hooks run when fetching data to display in the Main Page
 */

import { useEffect } from "react";

import mainStore from "../stores/mainStore";
import dataStore from "../stores/dataStore";
import { allData } from "../stores/dataStore";

// Type for fetchData params
type Request = {
  method: string;
  headers: Record<string, string>;
  body?: string;
};

type Body = {
  [key: string]: string;
};

type BodyObj = {
  [key: string]: Body;
};

// For metrics graph: get time window from user query (dropdown)
function getWindowInSeconds(selectedTimeWindow: string) {
  switch (selectedTimeWindow) {
    case "5m":
      return 300;
    case "1h":
      return 3600;
    case "24h":
    default:
      return 86400;
  }
}
// Get time step corresponding to selected time window
// NOT IN USE
// function getTimeStep(selectedTimeWindow: string) {
//   switch (selectedTimeWindow) {
//     case "5m":
//       return "10";
//     case "1h":
//       return "60";
//     case "24h":
//     default:
//       return "600";
//   }
// }

const useFetchData = () => {
  const backendUrl = dataStore((state) => state.backendUrl);
  const {
    refreshFrequency,
    queryTimeWindow,
    podRestartCount,
    manualRefreshCount,
    historicalTimeWindow,
  } = mainStore();
  const { isFetchingData, setIsFetchingData, allData, setAllData } =
    dataStore();

  useEffect(
    () => {
      const fetchData = async <T>(
        method: string,
        endpoint: string,
        body?: Body,
      ): Promise<T | null> => {
        try {
          const request: Request = {
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
        setIsFetchingData(true);
        console.log(
          `Data fetch initiated at ${new Date().toLocaleTimeString()} - Frequency: ${refreshFrequency / 1000}s`,
        );

        // do not allow refresh frequency that's too fast
        if (refreshFrequency < 1000) {
          console.warn("Refresh frequency cannot be less than 1 sec!");
          setIsFetchingData(false);
          return;
        }

        const metricsTimeWindow = getWindowInSeconds(historicalTimeWindow);

        const metricsConfig: BodyObj = {
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
            timeStart: (
              Math.floor(Date.now() / 1000) - metricsTimeWindow
            ).toString(),
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
            fetchData<allData["podsStatuses"]>("GET", "api/all-pods-status"),
            fetchData<allData["requestLimits"]>(
              "GET",
              "api/all-pods-request-limit",
            ),
            fetchData<allData["cpuUsageOneValue"]>(
              "POST",
              "api/resource-usage-onevalue",
              metricsConfig.bodyResourceUsageOnevalueCPU,
            ),
            fetchData<allData["memoryUsageOneValue"]>(
              "POST",
              "api/resource-usage-onevalue",
              metricsConfig.bodyResourceUsageOnevalueMemory,
            ),
            fetchData<allData["cpuUsageHistorical"]>(
              "POST",
              "api/resource-usage-historical",
              {
                ...metricsConfig.bodyResourceUsageHistorical,
                type: "cpu",
              },
            ),
            fetchData<allData["memoryUsageHistorical"]>(
              "POST",
              "api/resource-usage-historical",
              {
                ...metricsConfig.bodyResourceUsageHistorical,
                type: "memory",
              },
            ),
            fetchData<allData["latencyAppRequestOneValue"]>(
              "POST",
              "api/latency-app-request-onevalue",
              metricsConfig.bodyLatencyAppRequestOneValue,
            ),
            fetchData<allData["latencyAppRequestHistorical"]>(
              "POST",
              "api/latency-app-request-historical",
              metricsConfig.bodyResourceUsageHistorical,
            ),
          ]);

          setAllData({
            podsStatuses:
              // preserve the pod state during data refresh by merging existing pod data with new data
              (status &&
                !Array.isArray(status) && {
                  allPodsStatus: status.allPodsStatus.map((pod) => {
                    // check if pod is found in existing data
                    const existingPod = Array.isArray(allData.podsStatuses)
                      ? []
                      : allData.podsStatuses?.allPodsStatus?.find(
                          (existing) =>
                            existing.podName === pod.podName &&
                            existing.namespace === pod.namespace,
                        );
                    // if pod is found in existing data, update it with new data (if any)
                    // if pod is not found in existing data, add it
                    return existingPod ? { ...pod, ...existingPod } : pod;
                  }),
                }) ||
              [], // if status is null, set to empty array
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
          setIsFetchingData(false); //
        }
      };

      bigFetch(); // initial fetch

      // Only set up interval if refresh frequency is valid
      const intervalID = setInterval(bigFetch, refreshFrequency);

      return () => {
        clearInterval(intervalID);
      };
    },
    // need this comment to tell eslint to stop complaining about missing dependencies
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      refreshFrequency,
      manualRefreshCount,
      queryTimeWindow,
      podRestartCount,
      backendUrl,
      historicalTimeWindow,
    ],
  );

  return { isFetchingData, allData };
};

export default useFetchData;
