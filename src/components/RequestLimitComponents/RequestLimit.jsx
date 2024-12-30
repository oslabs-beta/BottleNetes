import PropTypes from "prop-types";
import { useState, useMemo } from "react";
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
import RequestLimitSorter from "./RequestLimitSorter";

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

  const bytesToMb = (memoryInBytes) => {
    return memoryInBytes ? memoryInBytes / (1024 * 1024) : null;
  };

  const podList = useMemo(() => {
    // Map raw data to our format, being careful to preserve null values, they caused lots of bugs :(
    let pods =
      requestLimits?.allPodsRequestLimit?.map((pod) => ({
        podName: pod.podName || "",
        // Only accept actual numbers, convert everything else to null
        cpuRequest: typeof pod.cpuRequest === "number" ? pod.cpuRequest : null,
        memoryRequest:
          typeof pod.memoryRequest === "number" ? pod.memoryRequest : null,
        cpuLimit: typeof pod.cpuLimit === "number" ? pod.cpuLimit : null,
        memoryLimit:
          typeof pod.memoryLimit === "number" ? pod.memoryLimit : null,
        cpuRequestLimitRatio:
          typeof pod.cpuRequestLimitRatio === "number"
            ? pod.cpuRequestLimitRatio
            : null,
        memoryRequestLimitRatio:
          typeof pod.memoryRequestLimitRatio === "number"
            ? pod.memoryRequestLimitRatio
            : null,
      })) || []; // Default to empty array if no data

    if (sortType) {
      pods.sort((a, b) => {
        // Helper to get the right metric value based on type and current metric
        const getValue = (pod, type) => {
          if (selectedMetric === "cpu") {
            switch (type) {
              case "request":
                return typeof pod.cpuRequest === "number"
                  ? pod.cpuRequest
                  : null;
              case "limit":
                return typeof pod.cpuLimit === "number" ? pod.cpuLimit : null;
              case "ratio":
                return typeof pod.cpuRequestLimitRatio === "number"
                  ? pod.cpuRequestLimitRatio
                  : null;
              default:
                return null;
            }
          } else {
            switch (type) {
              case "request":
                return typeof pod.memoryRequest === "number"
                  ? bytesToMb(pod.memoryRequest)
                  : null;
              case "limit":
                return typeof pod.memoryLimit === "number"
                  ? bytesToMb(pod.memoryLimit)
                  : null;
              case "ratio":
                return typeof pod.memoryRequestLimitRatio === "number"
                  ? pod.memoryRequestLimitRatio
                  : null;
              default:
                return null;
            }
          }
        };

        switch (sortType) {
          case "podName":
            return a.podName.localeCompare(b.podName);
          case "request":
          case "limit":
          case "ratio": {
            const aValue = getValue(a, sortType);
            const bValue = getValue(b, sortType);

            // Special handling for null values:
            // - If both null, keep original order
            // - If one is null, move it to the end
            // - Otherwise do normal numeric comparison
            if (aValue === null && bValue === null) return 0;
            if (aValue === null) return 1;
            if (bValue === null) return -1;
            return bValue - aValue;
          }
          default:
            return 0;
        }
      });
    }

    return pods;
  }, [requestLimits, sortType, selectedMetric]);

  // Prepare data for the chart, keeping null values intact
  const [limitDataToUse, requestDataToUse] = useMemo(() => {
    if (!podList?.length) return [[], []];

    const limits = podList.map((pod) =>
      selectedMetric === "cpu" ? pod.cpuLimit : bytesToMb(pod.memoryLimit),
    );

    const requests = podList.map((pod) =>
      selectedMetric === "cpu" ? pod.cpuRequest : bytesToMb(pod.memoryRequest),
    );

    return [limits, requests];
  }, [podList, selectedMetric]);

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

  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    barThickness: 30,
    maxBarThickness: 30,
    scales: {
      x: {
        position: "top", // Moved x-axis to top
        stacked: false,
        grid: { color: "transparent" },
        beginAtZero: true,
        ticks: {
          color: "#1e293b",
          font: { size: 14 },
          // Show "No data" for null values in the chart
          callback: function (value) {
            return value === null ? "No data" : value;
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

  const chartHeight = podList.length * 50;

  return (
    <div className="flex flex-col gap-4">
      <div className="px-4">
        <RequestLimitSorter setSortType={setSortType} />
      </div>
      <div className="overflow-y-auto p-4" style={{ height: chartHeight }}>
        {podList.length > 0 ? (
          <Bar options={options} data={data} />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-slate-900">No data available</p>
          </div>
        )}
      </div>
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
