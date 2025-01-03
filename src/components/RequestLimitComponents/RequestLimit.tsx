
import { useRequestLimitData } from "../../hooks/useRequestLimitData";
import { prepareRequestLimitChartData } from "../../utils/requestLimitUtils";

import RequestLimitSorter from "./RequestLimitSorter";

import { getRequestLimitChartOptions } from "../../config/requestLimitChartConfig";

import mainStore from "../../stores/mainStore";
import dataStore from "../../stores/dataStore";

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

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarController,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const RequestLimit = () => {
  const { selectedMetric } = mainStore();
  const requestLimits = dataStore((state) => state.allData.requestLimits);
  const sortType = dataStore((state) => state.sortType);

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

  const chartHeight = podList.length * 50;
  const options = getRequestLimitChartOptions(selectedMetric);

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4">
        <RequestLimitSorter />
      </div>
      <div className="overflow-y-auto p-4" style={{ height: chartHeight }}>
            {podList.length > 0 ? (
              <Bar options={options} data={chartData} />
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-slate-900">No data available</p>
              </div>
            )}
          </div>
    </div>
  );
};

export default RequestLimit;
