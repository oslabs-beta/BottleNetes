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
import { useLatencyData } from "../../hooks/useLatencyData";
import { latencyChartOptions } from "../../config/latencyChartOptions";

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

const Latency = ({
  defaultView,
  clickedPod,
  cpuUsageHistorical,
  latencyAppRequestHistorical,
}) => {
  const { isLoading, chartData } = useLatencyData(
    defaultView,
    clickedPod,
    cpuUsageHistorical,
    latencyAppRequestHistorical,
  );

  if (isLoading) {
    return <div className="font-semibold text-slate-800 dark:text-slate-200">Loading...</div>;
  }

  // console.log("latency data:", chartData);
  return (
    <div className="min-h-[450px] w-full rounded p-4">
      <Line options={latencyChartOptions} data={chartData} />
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
