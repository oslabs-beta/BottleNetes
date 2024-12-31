/**
 * This component renders the line graph representing the Latency
 */
import React from 'react';
import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  DatasetChartOptions,
  CoreChartOptions,
  ElementChartOptions,
  LineControllerChartOptions,
  PluginChartOptions,
  ScaleChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
);

import LoadingContainer from '../containers/LoadingContainer.tsx';

import mainStore from '../stores/mainStore.ts';
import dataStore from '../stores/dataStore.ts';
import { _DeepPartialObject } from 'chart.js/dist/types/utils';

const Latency = () => {
  const { defaultView, clickedPod } = mainStore();
  const cpuUsageHistorical = dataStore((state) => state.allData.cpuUsageHistorical);
  const latencyAppRequestHistorical = dataStore((state) => state.allData.latencyAppRequestHistorical);

  // First check if we have at least the CPU historical data for timestamps
  if (!Array.isArray(cpuUsageHistorical) && !cpuUsageHistorical?.resourceUsageHistorical?.[0]) {
    return <LoadingContainer />;
  }

  let timeStamps: any[] = [];
  let avgLatencyInboundAtEachTimestamp: any[] = [];
  let avgLatencyOutboundAtEachTimestamp: any[] = [];
  let peakLatencyOutboundAtEachTimestamp: any[] = [];
  let peakLatencyInboundAtEachTimestamp: any[] = [];

  // Use latency data if available, otherwise fall back to CPU data for timestamps
  const hasLatencyData =
    (!Array.isArray(latencyAppRequestHistorical) &&
    (latencyAppRequestHistorical?.latencyAppRequestHistorical?.length ?? 0) > 0);
    
  const timeStampsDataToUse = hasLatencyData
    ? latencyAppRequestHistorical?.latencyAppRequestHistorical[0]
    : !Array.isArray(cpuUsageHistorical) && cpuUsageHistorical.resourceUsageHistorical[0];

  timeStamps = timeStampsDataToUse && 'timestampsReadable' in timeStampsDataToUse ? timeStampsDataToUse.timestampsReadable.map((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }) : [];

  // If no latency data, use undefined as default values for all latencies
  if (!hasLatencyData) {
    const defaultData = new Array(timeStamps.length).fill(undefined);
    avgLatencyInboundAtEachTimestamp = defaultData;
    avgLatencyOutboundAtEachTimestamp = defaultData;
    peakLatencyOutboundAtEachTimestamp = defaultData;
    peakLatencyInboundAtEachTimestamp = defaultData;
  } else {
    if (defaultView) {
      const PodCount =
        latencyAppRequestHistorical?.latencyAppRequestHistorical.length ?? 0;

      // Calculate average for each timestamp
      for (let i = 0; i < timeStamps.length; i++) {
        let totalAvgLatencyInboundAtEachTimestamp = 0;
        let totalAvgLatencyOutboundAtEachTimestamp = 0;
        let totalPeakLatencyOutboundAtEachTimestamp = 0;
        let totalPeakLatencyInboundAtEachTimestamp = 0;

        latencyAppRequestHistorical?.latencyAppRequestHistorical.forEach(
          (pod) => {
            totalAvgLatencyInboundAtEachTimestamp +=
              Number(pod.avgInboundLatency[i]) || 0;

            totalAvgLatencyOutboundAtEachTimestamp +=
              Number(pod.avgOutboundLatency[i]) || 0;

            totalPeakLatencyOutboundAtEachTimestamp +=
              Number(pod.peakOutboundLatency[i]) || 0;

            totalPeakLatencyInboundAtEachTimestamp +=
              Number(pod.peakInboundLatency[i]) || 0;
          },
        );

        // Calculate averages
        avgLatencyInboundAtEachTimestamp.push(
          totalAvgLatencyInboundAtEachTimestamp / PodCount,
        );
        avgLatencyOutboundAtEachTimestamp.push(
          totalAvgLatencyOutboundAtEachTimestamp / PodCount,
        );
        peakLatencyOutboundAtEachTimestamp.push(
          totalPeakLatencyOutboundAtEachTimestamp / PodCount,
        );
        peakLatencyInboundAtEachTimestamp.push(
          totalPeakLatencyInboundAtEachTimestamp / PodCount,
        );
      }
    }

    if (!defaultView && clickedPod.podName) {
      // Find the clicked pod
      const clickedLatencyPod =
        latencyAppRequestHistorical?.latencyAppRequestHistorical.find(
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
        avgLatencyOutboundAtEachTimestamp =
          clickedLatencyPod.avgOutboundLatency;
        peakLatencyOutboundAtEachTimestamp =
          clickedLatencyPod.peakOutboundLatency;
        peakLatencyInboundAtEachTimestamp =
          clickedLatencyPod.peakInboundLatency;
      }
    }
  }

  const options: _DeepPartialObject<CoreChartOptions<"line"> & ElementChartOptions<"line"> & PluginChartOptions<"line"> & DatasetChartOptions<"line"> & ScaleChartOptions<"line"> & LineControllerChartOptions> = {
    responsive: true,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          color: "#1e293b",
          font: { size: 14 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          color: "#1e293b",
          font: { size: 14 },
          callback: function (value) {
            return value + "ms";
          },
        },
      },
    },
    elements: {
      point: {
        radius: 0,
        hoverRadius: 6,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1e293b",
          font: { size: 15 },
        },
      },
      tooltip: {
        padding: 16,
        bodyFont: {
          size: 16,
        },
        titleFont: {
          size: 16,
        },
        backgroundColor: "#020617",
        caretSize: 10,
      },
    },
  };

  const data = {
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

  // console.log("latency data:");

  return (
    <div className="min-h-[400px] w-full rounded p-4">
      <Line options={options} data={data} />
    </div>
  );
};

Latency.propTypes = {
  defaultView: PropTypes.bool,
  clickedPod: PropTypes.object,
  cpuUsageHistorical: PropTypes.object,
  latencyAppRequestHistorical: PropTypes.object,
};

export default Latency;
