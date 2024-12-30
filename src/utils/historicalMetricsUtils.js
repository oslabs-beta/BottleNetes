export const getTimeStamps = (availableData) => {
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

export const processCpuData = (cpuUsageHistorical, timeStamps) => {
  let CpuUsageAtEachTimestamp = [];
  if (cpuUsageHistorical?.resourceUsageHistorical) {
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

export const processMemoryData = (memoryUsageHistorical, timeStamps) => {
  let MemoryUsageAtEachTimestamp = [];
  if (memoryUsageHistorical?.resourceUsageHistorical) {
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
