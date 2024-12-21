/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import { useEffect } from "react";
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

const RequestLimit = ({
  defaultView,
  clickedPod,
  selectedMetric,
  requestLimits,
}) => {
  const podList = requestLimits?.allPodsRequestLimit.map((pod) => ({
    podName: pod.podName,
    cpuRequest: pod.cpuRequest,
    memoryRequest: pod.memoryRequest,
    cpuLimit: pod.cpuLimit,
    memoryLimit: pod.memoryLimit,
    cpuRequestLimitRatio: pod.cpuRequestLimitRatio,
    memoryRequestLimitRatio: pod.memoryRequestLimitRatio,
  }));

  const options = {
    indexAxis: "y", // maybe making it horizontal?
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: { color: "transparent" },
        ticks: {
          color: "#1e293b",
          font: {
            size: 14,
          },
        },
        title: {
          display: true,
          text: selectedMetric === "cpu" ? "CPU (cores)" : "Memory (MB)",
          color: "#1e293b",
          font: { size: 14 },
        },
      },
      y: {
        stacked: false,
        grid: { color: "transparent" },
        ticks: {
          color: "#1e293b",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1e293b",
          font: {
            size: 15,
          },
        },
      },
      title: {
        display: false,
        text: `Request Limit for pod`,
        font: {
          size: 20,
        },
      },
      tooltip: {
        padding: 16,
        bodyFont: {
          size: 16,
          color: "#cbd5e1",
        },
        titleFont: {
          size: 16,
          color: "#cbd5e1",
        },
        backgroundColor: "#020617",
        caretSize: 10,
      },
    },
    barThickness: 20, // Control bar thickness
    barPercentage: 0.8, // Control bar width
    categoryPercentage: 0.9, // Control spacing between bar groups
  };

  const formatMemoryToMB = (memoryInBytes) => {
    return memoryInBytes / (1024 * 1024);
  };

  let limitDataToUse = [];
  let requestDataToUse = [];
  if (podList.length > 0) {
    switch (selectedMetric) {
      case "cpu":
        limitDataToUse = podList.map((pod) => pod.cpuLimit);
        requestDataToUse = podList.map((pod) => pod.cpuRequest);
        break;
      case "memory":
        limitDataToUse = podList.map((pod) =>
          formatMemoryToMB(pod.memoryLimit),
        );
        requestDataToUse = podList.map((pod) =>
          formatMemoryToMB(pod.memoryRequest),
        );
        break;
      case "latency":
        break;
      default:
        limitDataToUse = podList.map((pod) => pod.cpuLimit);
        requestDataToUse = podList.map((pod) => pod.cpuRequest);
    }
  }

  // Use empty data if no pod list or create data from pods
  const data = {
    labels: podList.map((pod) => pod.podName),
    datasets: [
      {
        label: "Requested Resources",
        data: requestDataToUse,
        backgroundColor: "rgba(191, 219, 254, 1)",
        borderRadius: 5,
        maxBarThickness: 20,
      },
      {
        label: "Resource Limits",
        data: limitDataToUse,
        backgroundColor: "rgba(59, 130, 246, 1)",
        borderRadius: 5,
        maxBarThickness: 20,
      },
    ],
  };

  return (
    <div className="min-h-[400px] w-full p-4">
      {podList.length > 0 ? (
        <Bar options={options} data={data} />
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-slate-900">No data available</p>
        </div>
      )}
    </div>
  );
};

RequestLimit.propTypes = {
  defaultView: PropTypes.bool,
  clickedPod: PropTypes.string,
  selectedMetric: PropTypes.string,
  requestLimits: PropTypes.object,
};

export default RequestLimit;
