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
  // Check if we have at least one type of data
  if (
    !cpuUsageHistorical?.resourceUsageHistorical &&
    !memoryUsageHistorical?.resourceUsageHistorical
  ) {
    return <div>Loading...</div>;
  }

  let timeStamps = [];
  let CpuUsageAtEachTimestamp = [];
  let MemoryUsageAtEachTimestamp = [];

  // Use timestamps from whichever dataset is available
  let availableData;
  const cpuData = cpuUsageHistorical?.resourceUsageHistorical?.[0];
  const memoryData = memoryUsageHistorical?.resourceUsageHistorical?.[0];

  // if CPU data is available, use its timestamps
  if (cpuData?.timestampsReadable) {
    availableData = cpuData;
    // if memory data is available, use its timestamps
  } else if (memoryData?.timestampsReadable) {
    availableData = memoryData;
  }

  timeStamps = availableData.timestampsReadable.map((timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  });

  // if default view, show average of all pods
  if (defaultView) {
    // Process CPU data if available
    if (cpuUsageHistorical?.resourceUsageHistorical) {
      // get the number of pods with CPU data
      const cpuPodCount = cpuUsageHistorical.resourceUsageHistorical.length;
      for (let i = 0; i < timeStamps.length; i++) {
        let totalCpuUsageAtThisTimeStamp = 0;
        cpuUsageHistorical.resourceUsageHistorical.forEach((pod) => {
          totalCpuUsageAtThisTimeStamp += Number(pod.usageRelative[i]) || 0;
        });
        CpuUsageAtEachTimestamp.push(
          // divide by the number of pods to get the average
          totalCpuUsageAtThisTimeStamp / cpuPodCount,
        );
      }
    }

    // Process Memory data if available
    if (memoryUsageHistorical?.resourceUsageHistorical) {
      const memoryPodCount =
        memoryUsageHistorical.resourceUsageHistorical.length;
      for (let i = 0; i < timeStamps.length; i++) {
        let totalMemoryUsageAtThisTimeStamp = 0;
        memoryUsageHistorical.resourceUsageHistorical.forEach((pod) => {
          totalMemoryUsageAtThisTimeStamp += Number(pod.usageRelative[i]) || 0;
        });
        MemoryUsageAtEachTimestamp.push(
          totalMemoryUsageAtThisTimeStamp / memoryPodCount,
        );
      }
    }
  }

  // if a pod is clicked, show only its data
  if (!defaultView && clickedPod.podName) {
    // Process CPU data if available
    if (cpuUsageHistorical?.resourceUsageHistorical) {
      // find the clicked pod in the CPU data, using pod name
      const clickedCpuPod = cpuUsageHistorical.resourceUsageHistorical.find(
        (pod) => pod.name === clickedPod.podName,
      );
      CpuUsageAtEachTimestamp = clickedCpuPod?.usageRelative || [];
    }
    // Process Memory data if available
    if (memoryUsageHistorical?.resourceUsageHistorical) {
      const clickedMemoryPod =
        memoryUsageHistorical.resourceUsageHistorical.find(
          (pod) => pod.name === clickedPod.podName,
        );
      MemoryUsageAtEachTimestamp = clickedMemoryPod?.usageRelative || [];
    }
  }

  const options = {
    responsive: true,
    interaction: {
      mode: "nearest",
      intersect: false,
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          color: "#1e293b",
          font: { size: 14 },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          color: "#1e293b",
          font: { size: 14 },
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    elements: {
      point: {
        radius: 1,
        hoverRadius: 6,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
        title: {
          display: true,
          text: "CPU and Memory Usage over time",
          color: "#1e293b",
          padding: 5,
        },
        labels: {
          color: "#1e293b",
          font: { size: 15 },
        },
      },
      tooltip: {
        padding: 16,
        boxPadding: 10,
        bodyFont: {
          size: 14,
        },
        titleFont: {
          size: 20,
          weight: "bold",
        },
        bodyColor: "#1f1f1f",
        titleColor: "#404040",
        backgroundColor: "#e9e9e9",
        caretSize: 10,
      },
    },
  };

  const datasets = [];
  if (CpuUsageAtEachTimestamp.length > 0) {
    datasets.push({
      label: "CPU Usage (% of requested)",
      data: CpuUsageAtEachTimestamp,
      borderColor: "rgb(59, 130, 246)",
      backgroundColor: "rgb(59, 130, 246)",
      tension: 0.4,
    });
  }

  if (MemoryUsageAtEachTimestamp.length > 0) {
    datasets.push({
      label: "RAM Usage (% of requested)",
      data: MemoryUsageAtEachTimestamp,
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
    <div className="w-full min-h-[600px] max-h-fit relative p-4">
      <Line options={options} data={data} />
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
