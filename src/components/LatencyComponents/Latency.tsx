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

import LoadingContainer from "../../containers/LoadingContainer.tsx";

import { useLatencyData } from "../../hooks/useLatencyData";
import { latencyChartOptions } from "../../config/latencyChartOptions";

import mainStore from "../../stores/mainStore.ts"
import dataStore from "../../stores/dataStore.ts"

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

const Latency = () => {
  const { defaultView, clickedPod } = mainStore();
  const cpuUsageHistorical = dataStore((state) => state.allData.cpuUsageHistorical);
  const latencyAppRequestHistorical = dataStore((state) => state.allData.latencyAppRequestHistorical);

  const { isLoading, chartData } = useLatencyData(
    defaultView,
    clickedPod,
    cpuUsageHistorical,
    latencyAppRequestHistorical,
  );

  if (isLoading) {
    return <LoadingContainer />;
  }

  return (
    <div className="min-h-[400px] w-full rounded p-4 text-center">
      {chartData ? (
        <Line options={latencyChartOptions} data={chartData} />
      ) : (
        <p>No data available...</p>
      )}
    </div>
  );
};

export default Latency;
