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

import { useLatencyData } from "../../hooks/useLatencyData";
import { latencyChartOptions } from "../../config/latencyChartOptions";

import mainStore from "../../stores/mainStore"
import dataStore from "../../stores/dataStore"

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
    return <div className="font-semibold text-slate-800 dark:text-slate-200">Loading...</div>;
  }

  return (
    <div className="min-h-[450px] w-full rounded p-4 text-center">
      {chartData ? (
        <Line options={latencyChartOptions} data={chartData} />
      ) : (
        <p>No data available...</p>
      )}
    </div>
  );
};

export default Latency;
