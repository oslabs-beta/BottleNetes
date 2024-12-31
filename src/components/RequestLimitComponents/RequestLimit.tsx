import React from 'react';

import { useRequestLimitData } from "../../hooks/useRequestLimitData.ts";
import { prepareRequestLimitChartData } from "../../utils/requestLimitUtils.ts";
import RequestLimitSorter from "./RequestLimitSorter.jsx";
import RequestLimitChart from "./RequestLimitChart.jsx";
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

import mainStore from "../../stores/mainStore.ts";
import dataStore from "../../stores/dataStore.ts";

const RequestLimit = () => {

  const { selectedMetric } = mainStore();
  const requestLimits = dataStore((state) => state.allData.requestLimits);
  const { sortType, setSortType } = dataStore();

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
        backgroundColor: "rgba(191, 219, 254)",
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

export default RequestLimit;
