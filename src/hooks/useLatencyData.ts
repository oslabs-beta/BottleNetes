import { State } from "../stores/dataStore";
import { State as mainState } from "../stores/mainStore";

export const useLatencyData = (
  defaultView: mainState["defaultView"],
  clickedPod: mainState["clickedPod"],
  cpuUsageHistorical: State["allData"]["cpuUsageHistorical"],
  latencyAppRequestHistorical: State["allData"]["latencyAppRequestHistorical"],
) => {
  // First check if we have at least the CPU historical data for timestamps
  if (
    !Array.isArray(cpuUsageHistorical) &&
    !cpuUsageHistorical?.resourceUsageHistorical?.[0]
  ) {
    return { isLoading: true };
  }

  let timeStamps: string[] = [];
  let avgLatencyInboundAtEachTimestamp: number[] = [];
  let avgLatencyOutboundAtEachTimestamp: number[] = [];
  let peakLatencyOutboundAtEachTimestamp: number[] = [];
  let peakLatencyInboundAtEachTimestamp: number[] = [];

  // Use latency data if available, otherwise fall back to CPU data for timestamps
  const hasLatencyData = Array.isArray(latencyAppRequestHistorical)
    ? false
    : (latencyAppRequestHistorical?.latencyAppRequestHistorical?.length ??
      0 > 0);

  const timeStampsDataToUse = hasLatencyData
    ? Array.isArray(latencyAppRequestHistorical)
      ? undefined
      : latencyAppRequestHistorical?.latencyAppRequestHistorical[0]
    : Array.isArray(cpuUsageHistorical)
      ? undefined
      : cpuUsageHistorical.resourceUsageHistorical[0];

  timeStamps = (timeStampsDataToUse?.timestampsReadable ?? []).map(
    (timestamp) => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    },
  );

  // If no latency data, use undefined as default values for all latencies
  if (!hasLatencyData) {
    const defaultData = new Array(timeStamps.length).fill(undefined);
    avgLatencyInboundAtEachTimestamp = defaultData;
    avgLatencyOutboundAtEachTimestamp = defaultData;
    peakLatencyOutboundAtEachTimestamp = defaultData;
    peakLatencyInboundAtEachTimestamp = defaultData;
  } else if (defaultView) {
    const PodCount = Array.isArray(latencyAppRequestHistorical)
      ? 0
      : latencyAppRequestHistorical?.latencyAppRequestHistorical.length;

    // Calculate average for each timestamp
    for (let i = 0; i < timeStamps.length; i++) {
      let totalAvgLatencyInboundAtEachTimestamp = 0;
      let totalAvgLatencyOutboundAtEachTimestamp = 0;
      let totalPeakLatencyOutboundAtEachTimestamp = 0;
      let totalPeakLatencyInboundAtEachTimestamp = 0;

      if (!Array.isArray(latencyAppRequestHistorical)) {
        latencyAppRequestHistorical?.latencyAppRequestHistorical.forEach(
          (pod) => {
            totalAvgLatencyInboundAtEachTimestamp +=
              pod.avgInboundLatency[i] || 0;
            totalAvgLatencyOutboundAtEachTimestamp +=
              pod.avgOutboundLatency[i] || 0;
            totalPeakLatencyOutboundAtEachTimestamp +=
              pod.peakOutboundLatency[i] || 0;
            totalPeakLatencyInboundAtEachTimestamp +=
              pod.peakInboundLatency[i] || 0;
          },
        );
      }

      // Calculate averages
      avgLatencyInboundAtEachTimestamp.push(
        PodCount ? totalAvgLatencyInboundAtEachTimestamp / PodCount : 0,
      );
      avgLatencyOutboundAtEachTimestamp.push(
        PodCount ? totalAvgLatencyOutboundAtEachTimestamp / PodCount : 0,
      );
      peakLatencyOutboundAtEachTimestamp.push(
        PodCount ? totalPeakLatencyOutboundAtEachTimestamp / PodCount : 0,
      );
      peakLatencyInboundAtEachTimestamp.push(
        PodCount ? totalPeakLatencyInboundAtEachTimestamp / PodCount : 0,
      );
    }
  } else if (clickedPod.podName) {
    // Find the clicked pod
    const clickedLatencyPod = Array.isArray(latencyAppRequestHistorical)
      ? undefined
      : latencyAppRequestHistorical?.latencyAppRequestHistorical.find(
          (pod) => pod.name === clickedPod.podName,
        );

    // Clear existing arrays and push new data
    avgLatencyInboundAtEachTimestamp = [];
    avgLatencyOutboundAtEachTimestamp = [];
    peakLatencyOutboundAtEachTimestamp = [];
    peakLatencyInboundAtEachTimestamp = [];

    // If clicked pod exists, use its data
    if (clickedLatencyPod) {
      avgLatencyInboundAtEachTimestamp = clickedLatencyPod.avgInboundLatency;
      avgLatencyOutboundAtEachTimestamp = clickedLatencyPod.avgOutboundLatency;
      peakLatencyOutboundAtEachTimestamp =
        clickedLatencyPod.peakOutboundLatency;
      peakLatencyInboundAtEachTimestamp = clickedLatencyPod.peakInboundLatency;
    }
  }

  const chartData = {
    labels: timeStamps,
    datasets: [
      {
        label: "Average Latency of Inbound Requests",
        data: avgLatencyInboundAtEachTimestamp,
        borderColor: "rgb(59, 130, 246, 0.8)",
        backgroundColor: "rgb(59, 130, 246, 0.8)",
        tension: 0.4,
      },
      {
        label: "Average Latency of Outbound Requests",
        data: avgLatencyOutboundAtEachTimestamp,
        borderColor: "#3730a3",
        backgroundColor: "#3730a3",
        tension: 0.4,
      },
      {
        label: "Peak Latency of Inbound Requests",
        data: peakLatencyInboundAtEachTimestamp,
        borderColor: "rgb(170, 50, 56, 0.8)",
        backgroundColor: "rgb(170, 50, 56, 0.8)",
        tension: 0.4,
      },
      {
        label: "Peak Latency of Outbound Requests",
        data: peakLatencyOutboundAtEachTimestamp,
        borderColor: "rgb(20, 175, 74, 0.8)",
        backgroundColor: "rgb(20, 175, 74, 0.8)",
        tension: 0.4,
      },
    ],
  };

  return { isLoading: false, chartData };
};
