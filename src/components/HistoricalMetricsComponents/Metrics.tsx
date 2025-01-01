/**
 * This component renders the line graph representing historical CPU and Memory Usage data
 */

import TimeWindowSelector from "./TimeWindowSelector"
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

import { historicalMetricsChartOptions } from "../../config/historicalMetricsChartOptions";
import useMetricsData from "../../hooks/useMetricsData";

import mainStore from "../../stores/mainStore";
import dataStore from "../../stores/dataStore";

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
  const { defaultView, clickedPod, setHistoricalTimeWindow } = mainStore();
  const cpuUsageHistorical = dataStore((state) => state.allData.cpuUsageHistorical);
  const memoryUsageHistorical = dataStore((state) => state.allData.memoryUsageHistorical);



  const { timeStamps, cpu, memory } = useMetricsData(
    defaultView,
    clickedPod,
    cpuUsageHistorical,
    memoryUsageHistorical,
  );

  if (
    (!Array.isArray(cpuUsageHistorical) && !cpuUsageHistorical?.resourceUsageHistorical) &&
    (!Array.isArray(memoryUsageHistorical) && !memoryUsageHistorical?.resourceUsageHistorical)
  ) {
    return <div className="font-semibold text-slate-800 dark:text-slate-200">Loading...</div>;
  }

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
      borderColor: "#93c5fd",
      backgroundColor: "#93c5fd",
      tension: 0.4,
    });
  }

  const data = {
    labels: timeStamps,
    datasets: datasets,
  };

  return (
    <div>
      <div className="p-4">
        <div className="flex justify-end">
          <TimeWindowSelector
            onTimeWindowChange={(val) => setHistoricalTimeWindow(val)}
          />
        </div>
      </div>
      <div className="relative max-h-fit min-h-[600px] w-full p-4">
        <Line options={historicalMetricsChartOptions} data={data} />
      </div>
    </div>
  );
};

export default Metrics;
