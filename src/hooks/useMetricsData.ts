import { useMemo } from "react";
import {
  processCpuData,
  processMemoryData,
  getTimeStamps,
} from "../utils/historicalMetricsUtils";

export default function useMetricsData(
  defaultView,
  clickedPod,
  cpuUsageHistorical,
  memoryUsageHistorical,
) {
  const data = useMemo(() => {
    const cpuData = cpuUsageHistorical?.resourceUsageHistorical?.[0];
    const memoryData = memoryUsageHistorical?.resourceUsageHistorical?.[0];

    // Bail early if no data is available
    if (!cpuData && !memoryData) {
      return { timeStamps: [], cpu: [], memory: [] };
    }

    let availableData = cpuData?.timestampsReadable ? cpuData : memoryData;
    if (!availableData?.timestampsReadable) {
      return { timeStamps: [], cpu: [], memory: [] };
    }

    const timeStamps = getTimeStamps(availableData);
    let CpuUsageAtEachTimestamp = [];
    let MemoryUsageAtEachTimestamp = [];

    if (defaultView) {
      CpuUsageAtEachTimestamp = processCpuData(cpuUsageHistorical, timeStamps);
      MemoryUsageAtEachTimestamp = processMemoryData(
        memoryUsageHistorical,
        timeStamps,
      );
    }
    if (!defaultView && clickedPod.podName) {
      const clickedCpuPod = cpuUsageHistorical?.resourceUsageHistorical?.find(
        (pod) => pod.name === clickedPod.podName,
      );
      CpuUsageAtEachTimestamp = clickedCpuPod?.usageRelative || [];
      const clickedMemoryPod =
        memoryUsageHistorical?.resourceUsageHistorical?.find(
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
