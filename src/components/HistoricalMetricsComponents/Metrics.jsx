/**
 * This component renders the line graph representing historical CPU and Memory Usage data
 */

import PropTypes from "prop-types";
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

const Metrics = ({
  defaultView,
  clickedPod,
  cpuUsageHistorical,
  memoryUsageHistorical,
}) => {

  if (
    !cpuUsageHistorical?.resourceUsageHistorical &&
    !memoryUsageHistorical?.resourceUsageHistorical
  ) {
    return <div className="font-semibold text-slate-800 dark:text-slate-200">Loading...</div>;
  }

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
      <div><TimeWindowSelector onTimeWindowChange={onTimeWindowChange}/></div>
    <div className="relative max-h-fit min-h-[600px] w-full p-4">
      <Line options={historicalMetricsChartOptions} data={data} />
    </div>
    </div>
  );
};

Metrics.propTypes = {
  defaultView: PropTypes.bool,
  clickedPod: PropTypes.object,
  cpuUsageHistorical: PropTypes.object,
  memoryUsageHistorical: PropTypes.object,
};

export default Metrics;
