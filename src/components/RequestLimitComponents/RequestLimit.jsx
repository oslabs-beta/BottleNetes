import PropTypes from "prop-types";
import { useState } from "react";
import { useRequestLimitData } from "../../hooks/useRequestLimitData";
import { prepareRequestLimitChartData } from "../../utils/requestLimitUtils";
import RequestLimitSorter from "./RequestLimitSorter";
import RequestLimitChart from "./RequestLimitChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const RequestLimit = ({ selectedMetric, requestLimits }) => {
  const [sortType, setSortType] = useState("");

  const podList = useRequestLimitData(requestLimits, sortType, selectedMetric);
  const [limitData, requestData] = prepareRequestLimitChartData(
    podList,
    selectedMetric,
  );

  const chartData = {
    labels: podList?.map((pod) => pod.podName) || [],
    datasets: [
      {
        label: "Requested Resources",
        data: requestData,
        backgroundColor: "#93c5fd",
        borderRadius: 5,
      },
      {
        label: "Resource Limits",
        data: limitData,
        backgroundColor: "rgba(59, 130, 246)",
        borderRadius: 5,
      },
    ],
  };

  if (podList.length === 0) {
    return <div className="font-semibold text-slate-800 dark:text-slate-200">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4">
        <RequestLimitSorter setSortType={setSortType} />
      </div>
      <RequestLimitChart
        data={chartData}
        selectedMetric={selectedMetric}
        podList={podList}
      />
    </div>
  );
};

RequestLimit.propTypes = {
  selectedMetric: PropTypes.string.isRequired,
  requestLimits: PropTypes.object.isRequired,
};

export default RequestLimit;
