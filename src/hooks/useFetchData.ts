/**
 * Hooks run when fetching data to display in the Main Page
 */

import { useEffect } from "react";

import mainStore from "../stores/mainStore.ts";
import dataStore from "../stores/dataStore.ts";

const backendUrl = dataStore((state) => state.backendUrl);

const {
  refreshFrequency,
  queryTimeWindow,
  podRestartCount,
  manualRefreshCount,
} = mainStore();

// Types for useFetchData params
interface FetchDataParams {
  backendUrl: typeof backendUrl;
  refreshFrequency: typeof refreshFrequency;
  queryTimeWindow: typeof queryTimeWindow;
  podRestartCount: typeof podRestartCount;
  manualRefreshCount: typeof manualRefreshCount;
}

// Type for fetchData params
type Request = {
  method: string;
  headers: Record<string, string>;
  body?: string;
};

const useFetchData = ({
  backendUrl,
  refreshFrequency,
  queryTimeWindow,
  podRestartCount,
  manualRefreshCount,
}: FetchDataParams) => {
  const { isFetchingData, setIsFetchingData, allData, setAllData } =
    dataStore();

  useEffect(
    () => {
      const fetchData = async (
        method: string,
        endpoint: string,
        body: Record<string, unknown> | null = null,
      ): Promise<Record<string, unknown> | null> => {
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
            podsStatuses:
              // preserve the pod state during data refresh by merging existing pod data with new data
              (status &&
                Array.isArray(status.allPodsStatus) && {
                  allPodsStatus: status.allPodsStatus.map((pod) => {
                    // check if pod is found in existing data
                    const existingPod = Array.isArray(allData.podsStatuses)
                      ? undefined
                      : allData.podsStatuses?.allPodsStatus?.find(
                          (existing) =>
                            existing.podName === pod.podName &&
                            existing.namespace === pod.namespace,
                        );
                    // if pod is found in existing data, update it with new data (if any)
                    // if pod is not found in existing data, add it
                    return existingPod ? { ...existingPod, ...pod } : pod;
                  }),
                }) ||
              [], // if status is null, set to empty array
            requestLimits:
              (requestLimits &&
                Array.isArray(requestLimits.allPodsRequestLimit) && {
                  allPodsRequestLimit: requestLimits.allPodsRequestLimit,
                }) ||
              [],
            allNodes: {
              allNodes: [{ nodeName: "Minikube", clusterName: "Minikube" }],
            },
            cpuUsageOneValue:
              (cpuUsageOneValue &&
                Array.isArray(cpuUsageOneValue.resourceUsageOneValue) && {
                  resourceUsageOneValue: cpuUsageOneValue.resourceUsageOneValue,
                }) ||
              [],
            memoryUsageOneValue:
              (memoryUsageOneValue &&
                Array.isArray(memoryUsageOneValue.resourceUsageOneValue) && {
                  resourceUsageOneValue:
                    memoryUsageOneValue.resourceUsageOneValue,
                }) ||
              [],
            cpuUsageHistorical:
              (cpuUsageHistorical &&
                Array.isArray(cpuUsageHistorical.resourceUsageHistorical) && {
                  resourceUsageHistorical:
                    cpuUsageHistorical.resourceUsageHistorical,
                }) ||
              [],
            memoryUsageHistorical:
              (memoryUsageHistorical &&
                Array.isArray(
                  memoryUsageHistorical.resourceUsageHistorical,
                ) && {
                  resourceUsageHistorical:
                    memoryUsageHistorical.resourceUsageHistorical,
                }) ||
              [],
            latencyAppRequestOneValue:
              (latencyAppRequestOneValue &&
                Array.isArray(
                  latencyAppRequestOneValue.latencyAppRequestOneValue,
                ) && {
                  latencyAppRequestOneValue:
                    latencyAppRequestOneValue.latencyAppRequestOneValue,
                }) ||
              [],
            latencyAppRequestHistorical:
              (latencyAppRequestHistorical &&
                Array.isArray(
                  latencyAppRequestHistorical.latencyAppRequestHistorical,
                ) && {
                  latencyAppRequestHistorical:
                    latencyAppRequestHistorical.latencyAppRequestHistorical,
                }) ||
              [],
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
      // note: Do not include allData.podsStatuses.allPodsStatus from dependencies! (will cause crazy fast refresh)
    ],
  );

  return { isFetchingData, allData };
};

export default useFetchData;
