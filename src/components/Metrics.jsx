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
  // Check if we have data first
  if (
    !cpuUsageHistorical?.resourceUsageHistorical ||
    !memoryUsageHistorical?.resourceUsageHistorical
  ) {
    return <div>Loading...</div>;
  }

  // console.log("clickedPod", clickedPod);

  let timeStamps = [];
  let CpuUsageAtEachTimestamp = [];
  let MemoryUsageAtEachTimestamp = [];

  timeStamps =
    cpuUsageHistorical.resourceUsageHistorical[0].timestampsReadable.map(
      (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
      },
    );

  if (defaultView) {
    const cpuPodCount = cpuUsageHistorical.resourceUsageHistorical.length;
    const memoryPodCount = memoryUsageHistorical.resourceUsageHistorical.length;

    // Calculate average for each timestamp
    for (let i = 0; i < timeStamps.length; i++) {
      let totalCpuUsageAtThisTimeStamp = 0;
      let totalMemoryUsageAtThisTimeStamp = 0;

      // Sum CPU usage for all pods at this timestamp
      cpuUsageHistorical.resourceUsageHistorical.forEach((pod) => {
        totalCpuUsageAtThisTimeStamp += Number(pod.usageRelative[i]) || 0;
      });

      // Sum Memory usage for all pods at this timestamp
      memoryUsageHistorical.resourceUsageHistorical.forEach((pod) => {
        totalMemoryUsageAtThisTimeStamp += Number(pod.usageRelative[i]) || 0;
      });

      // Calculate averages
      CpuUsageAtEachTimestamp.push(totalCpuUsageAtThisTimeStamp / cpuPodCount);
      MemoryUsageAtEachTimestamp.push(
        totalMemoryUsageAtThisTimeStamp / memoryPodCount,
      );
    }
  }

  if (!defaultView && clickedPod.podName) {
    // Find the clicked pod
    const clickedCpuPod = cpuUsageHistorical.resourceUsageHistorical.find(
      (pod) => pod.name === clickedPod.podName,
    );
    const clickedMemoryPod = memoryUsageHistorical.resourceUsageHistorical.find(
      (pod) => pod.name === clickedPod.podName,
    );

    // Clear existing arrays and push new data
    CpuUsageAtEachTimestamp = [];
    MemoryUsageAtEachTimestamp = [];

    if (clickedCpuPod && clickedMemoryPod) {
      CpuUsageAtEachTimestamp = clickedCpuPod.usageRelative;
      MemoryUsageAtEachTimestamp = clickedMemoryPod.usageRelative;
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
          text: "CPU and Memory Usage",
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

  const data = {
    labels: timeStamps,
    datasets: [
      {
        label: "CPU Usage (% of requested)",
        data: CpuUsageAtEachTimestamp,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
      {
        label: "RAM Usage (% of requested)",
        data: MemoryUsageAtEachTimestamp,
        borderColor: "#3730a3",
        backgroundColor: "#3730a3",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-[400px] w-full rounded p-4">
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
