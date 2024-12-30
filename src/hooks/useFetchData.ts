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

  useEffect(() => {
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
        setIsFetchingData(false);
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

  return { isFetchingData, allData };
};

export default useFetchData;
