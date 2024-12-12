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
import { use } from "react";

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

  if (!defaultView && clickedPod) {
    // Find the clicked pod
    const clickedCpuPod = cpuUsageHistorical.resourceUsageHistorical.find(
      (pod) => pod.name === clickedPod,
    );
    const clickedMemoryPod = memoryUsageHistorical.resourceUsageHistorical.find(
      (pod) => pod.name === clickedPod,
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
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
        grid: {
          color: "rgba(30, 41, 59, 0.1)",
          drawBorder: false,
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
          color: "rgba(30, 41, 59, 0.1)",
          drawBorder: false,
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
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1e293b",
          font: { size: 15 },
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

  const data = {
    labels: timeStamps,
    datasets: [
      {
        label: "CPU Usage (% of requested)",
        data: CpuUsageAtEachTimestamp,
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
      {
        label: "RAM Usage (% of requested)",
        data: MemoryUsageAtEachTimestamp,
        borderColor: "rgb(147, 51, 234)",
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
  clickedPod: PropTypes.string,
  cpuUsageHistorical: PropTypes.object,
  memoryUsageHistorical: PropTypes.object,
};

export default Metrics;
