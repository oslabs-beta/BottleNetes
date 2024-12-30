/**
 * This component renders the line graph representing historical CPU and Memory Usage data
 */

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

Metrics.propTypes = {
  defaultView: PropTypes.bool,
  clickedPod: PropTypes.object,
  cpuUsageHistorical: PropTypes.object,
  memoryUsageHistorical: PropTypes.object,
};

export default Metrics;