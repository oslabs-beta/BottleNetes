import { useMemo } from "react";
import {
  processCpuData,
  processMemoryData,
  getTimeStamps,
} from "../utils/historicalMetricsUtils";

import { State as mainState } from "../stores/mainStore";
import { State } from "../stores/dataStore";

export default function useMetricsData(
  defaultView: mainState["defaultView"],
  clickedPod: mainState["clickedPod"],
  cpuUsageHistorical: State["allData"]["cpuUsageHistorical"],
  memoryUsageHistorical: State["allData"]["memoryUsageHistorical"],
) {
  const data = useMemo(() => {
    const cpuData = Array.isArray(cpuUsageHistorical)
      ? undefined
      : cpuUsageHistorical?.resourceUsageHistorical?.[0];
    const memoryData = Array.isArray(memoryUsageHistorical)
      ? undefined
      : memoryUsageHistorical?.resourceUsageHistorical?.[0];

    // Bail early if no data is available
    if (!cpuData && !memoryData) {
      return { timeStamps: [], cpu: [], memory: [] };
    }

    const availableData = cpuData?.timestampsReadable ? cpuData : memoryData;
    if (!availableData?.timestampsReadable) {
      return { timeStamps: [], cpu: [], memory: [] };
    }

    const timeStamps = getTimeStamps(availableData);
    let CpuUsageAtEachTimestamp: number[] = [];
    let MemoryUsageAtEachTimestamp: number[] = [];

    if (defaultView) {
      CpuUsageAtEachTimestamp = processCpuData(cpuUsageHistorical, timeStamps);
      MemoryUsageAtEachTimestamp = processMemoryData(
        memoryUsageHistorical,
        timeStamps,
      );
    }
    if (!defaultView && clickedPod.podName) {
      const clickedCpuPod = Array.isArray(cpuUsageHistorical)
        ? undefined
        : cpuUsageHistorical?.resourceUsageHistorical?.find(
            (pod) => pod.name === clickedPod.podName,
          );
      CpuUsageAtEachTimestamp = clickedCpuPod?.usageRelative || [];
      const clickedMemoryPod = Array.isArray(memoryUsageHistorical)
        ? undefined
        : memoryUsageHistorical?.resourceUsageHistorical?.find(
            (pod) => pod.name === clickedPod.podName,
          );
      MemoryUsageAtEachTimestamp = clickedMemoryPod?.usageRelative || [];
    }

    return {
      timeStamps,
      cpu: CpuUsageAtEachTimestamp,
      memory: MemoryUsageAtEachTimestamp,
    };
  }, [defaultView, clickedPod, cpuUsageHistorical, memoryUsageHistorical]);

  return data;
}
