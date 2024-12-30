/**
 * This component renders the bar graph representing Resource Requests and Limits for each pod
 */

import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
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
  // Add null check and default to empty array (to fix the erros sometimes thrown by browser console)
  const podList =
    requestLimits?.allPodsRequestLimit?.map((pod) => ({
      podName: pod.podName || "",
      cpuRequest: pod.cpuRequest || 0,
      memoryRequest: pod.memoryRequest || 0,
      cpuLimit: pod.cpuLimit || 0,
      memoryLimit: pod.memoryLimit || 0,
      cpuRequestLimitRatio: pod.cpuRequestLimitRatio || 0,
      memoryRequestLimitRatio: pod.memoryRequestLimitRatio || 0,
    })) || [];

  const options = {
    indexAxis: "y", // maybe making it horizontal?
    responsive: true,
    maintainAspectRatio: false,
    barThickness: 30,
    maxBarThickness: 30,
    scales: {
      x: {
        stacked: false,
        grid: { color: "transparent" },
        beginAtZero: true,
        ticks: {
          color: "#1e293b",
          font: {
            size: 14,
          },
        },
        title: {
          display: true,
          text: selectedMetric === "cpu" ? "CPU (Cores)" : "Memory (Mi)",
          color: "#1e293b",
          font: { size: 14 },
        },
      },
      y: {
        stacked: true,
        grid: { color: "transparent" },
        ticks: {
          autoSkip: false,
          color: "#1e293b",
          font: {
            size: 14,
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
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
  };

  const formatMemoryToMB = (memoryInBytes) => {
    return memoryInBytes / (1024 * 1024);
  };

  let limitDataToUse = [];
  let requestDataToUse = [];

  // Only process data if podList exists and has items
  if (podList && podList.length > 0) {
    switch (selectedMetric) {
      case "cpu":
        limitDataToUse = podList.map((pod) => pod.cpuLimit || 0);
        requestDataToUse = podList.map((pod) => pod.cpuRequest || 0);
        break;
      case "memory":
        limitDataToUse = podList.map((pod) =>
          formatMemoryToMB(pod.memoryLimit || 0),
        );
        requestDataToUse = podList.map((pod) =>
          formatMemoryToMB(pod.memoryRequest || 0),
        );
        break;
      case "latency":
        break;
      default:
        limitDataToUse = podList.map((pod) => pod.cpuLimit || 0);
        requestDataToUse = podList.map((pod) => pod.cpuRequest || 0);
    }
  }

  // Data object with safe defaults
  const data = {
    labels: podList?.map((pod) => pod.podName) || [],
    datasets: [
      {
        label: "Requested Resources",
        data: requestDataToUse,
        backgroundColor: "rgba(191, 219, 254)",
        borderRadius: 5,
      },
      {
        label: "Resource Limits",
        data: limitDataToUse,
        backgroundColor: "rgba(59, 130, 246)",
        borderRadius: 5,
      },
    ],
  };

  const chartHeight = podList.length * 50;

  return (
    <div className="overflow-y-auto p-4" style={{ height: chartHeight }}>
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
  defaultView: PropTypes.bool.isRequired,
  clickedPod: PropTypes.object.isRequired,
  selectedMetric: PropTypes.string.isRequired,
  requestLimits: PropTypes.object.isRequired,
};

export default RequestLimit;
