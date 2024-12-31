import { resourceUsageHistoricalObj, allData } from "../stores/dataStore.ts";

export const getTimeStamps = (availableData: resourceUsageHistoricalObj) => {
  return availableData.timestampsReadable.map((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  });
};

export const processCpuData = (cpuUsageHistorical: allData['cpuUsageHistorical'], timeStamps: string[]) => {
  let CpuUsageAtEachTimestamp = [];
  if (!Array.isArray(cpuUsageHistorical) && cpuUsageHistorical?.resourceUsageHistorical) {
    const cpuPodCount = cpuUsageHistorical.resourceUsageHistorical.length;
    for (let i = 0; i < timeStamps.length; i++) {
      let totalCpuUsageAtThisTimeStamp = 0;
      cpuUsageHistorical.resourceUsageHistorical.forEach((pod) => {
        totalCpuUsageAtThisTimeStamp += Number(pod.usageRelative[i]) || 0;
      });
      CpuUsageAtEachTimestamp.push(totalCpuUsageAtThisTimeStamp / cpuPodCount);
    }
  }
  return CpuUsageAtEachTimestamp;
};

export const processMemoryData = (memoryUsageHistorical: allData['memoryUsageHistorical'], timeStamps: string[]) => {
  let MemoryUsageAtEachTimestamp = [];
  if (!Array.isArray(memoryUsageHistorical) && memoryUsageHistorical?.resourceUsageHistorical) {
    const memoryPodCount = memoryUsageHistorical.resourceUsageHistorical.length;
    for (let i = 0; i < timeStamps.length; i++) {
      let totalMemoryUsageAtThisTimeStamp = 0;
      memoryUsageHistorical.resourceUsageHistorical.forEach((pod) => {
        totalMemoryUsageAtThisTimeStamp += Number(pod.usageRelative[i]) || 0;
      });
      MemoryUsageAtEachTimestamp.push(
        totalMemoryUsageAtThisTimeStamp / memoryPodCount,
      );
    }
  }
  return MemoryUsageAtEachTimestamp;
};
