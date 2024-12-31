/**
 * This component renders the line graph representing historical CPU and Memory Usage data
 */
import React from "react";
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
} from "chart.js";

import { historicalMetricsChartOptions } from "../../config/historicalMetricsChartOptions.ts";
import useMetricsData from "../../hooks/useMetricsData.ts";

import mainStore from "../../stores/mainStore.ts";
import dataStore from "../../stores/dataStore.ts";

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

const Metrics = () => {
  const { defaultView, clickedPod } = mainStore();
  const cpuUsageHistorical = dataStore((state) => state.allData.cpuUsageHistorical);
  const memoryUsageHistorical = dataStore((state) => state.allData.memoryUsageHistorical);

  const { timeStamps, cpu, memory } = useMetricsData(
    defaultView,
    clickedPod,
    cpuUsageHistorical,
    memoryUsageHistorical,
  );

  const datasets = [];

  if (cpu.length > 0) {
    datasets.push({
      label: "CPU Usage (% of requested)",
      data: cpu,
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgb(59, 130, 246)",
      tension: 0.4,
    });
  }

  if (memory.length > 0) {
    datasets.push({
      label: "RAM Usage (% of requested)",
      data: memory,
      borderColor: "#3730a3",
      backgroundColor: "#3730a3",
      tension: 0.4,
    });
  }

  const data = {
    labels: timeStamps,
    datasets: datasets,
  };

  return (
    <div className="relative max-h-fit min-h-[600px] w-full p-4">
      <Line options={historicalMetricsChartOptions} data={data} />
    </div>
  );
};

export default Metrics;
