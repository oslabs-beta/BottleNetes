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

const Latency = ({ defaultView, clickedPod, latencyAppRequestHistorical }) => {
  // Check if we have data first
  if (!latencyAppRequestHistorical?.latencyAppRequestHistorical) {
    return <div>Loading...</div>;
  }

  let timeStamps = [];
  let avgLatencyInboundAtEachTimestamp = [];
  let avgLatencyOutboundAtEachTimestamp = [];
  let peakLatencyOutboundAtEachTimestamp = [];
  let peakLatencyInboundAtEachTimestamp = [];

  // timeStamps =
  //   latencyAppRequestHistorical.latencyAppRequestHistorical[0].timestampsReadable.map(
  //     (timestamp) => {
  //       const date = new Date(timestamp);
  //       return date.toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //         second: "2-digit",
  //         hour12: false,
  //       });
  //     },
  //   );

  if (defaultView) {
    const PodCount =
      latencyAppRequestHistorical.latencyAppRequestHistorical.length;

    // Calculate average for each timestamp
    for (let i = 0; i < timeStamps.length; i++) {
      let totalAvgLatencyInboundAtEachTimestamp = 0;
      let totalAvgLatencyOutboundAtEachTimestamp = 0;
      let totalPeakLatencyOutboundAtEachTimestamp = 0;
      let totalPeakLatencyInboundAtEachTimestamp = 0;

      latencyAppRequestHistorical.latencyAppRequestHistorical.forEach((pod) => {
        totalAvgLatencyInboundAtEachTimestamp +=
          Number(pod.avgInboundLatency[i]) || 0;

        totalAvgLatencyOutboundAtEachTimestamp +=
          Number(pod.avgOutboundLatency[i]) || 0;

        totalPeakLatencyOutboundAtEachTimestamp +=
          Number(pod.peakOutboundLatency[i]) || 0;

        totalPeakLatencyInboundAtEachTimestamp +=
          Number(pod.peakInboundLatency[i]) || 0;
      });

      // Calculate averages
      avgLatencyInboundAtEachTimestamp.push(
        totalAvgLatencyInboundAtEachTimestamp / PodCount,
      );
      avgLatencyOutboundAtEachTimestamp.push(
        totalAvgLatencyOutboundAtEachTimestamp / PodCount,
      );
      peakLatencyOutboundAtEachTimestamp.push(
        totalPeakLatencyOutboundAtEachTimestamp / PodCount,
      );
      peakLatencyInboundAtEachTimestamp.push(
        totalPeakLatencyInboundAtEachTimestamp / PodCount,
      );
    }
  }

  if (!defaultView && clickedPod) {
    // Find the clicked pod
    const clickedLatencyPod =
      latencyAppRequestHistorical.latencyAppRequestHistorical.find(
        (pod) => pod.name === clickedPod,
      );

    // Clear existing arrays and push new data
    avgLatencyInboundAtEachTimestamp = [];
    avgLatencyOutboundAtEachTimestamp = [];
    peakLatencyOutboundAtEachTimestamp = [];
    peakLatencyInboundAtEachTimestamp = [];

    if (clickedLatencyPod) {
      avgLatencyInboundAtEachTimestamp = clickedLatencyPod.avgInboundLatency;
      avgLatencyOutboundAtEachTimestamp = clickedLatencyPod.avgOutboundLatency;
      peakLatencyOutboundAtEachTimestamp =
        clickedLatencyPod.peakOutboundLatency;
      peakLatencyInboundAtEachTimestamp = clickedLatencyPod.peakInboundLatency;
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
            return value + "ms";
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
        label: "Average Latency of Inbound Requests",
        data: avgLatencyInboundAtEachTimestamp,
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4,
      },
      {
        label: "Average Latency of Outbound Requests",
        data: avgLatencyOutboundAtEachTimestamp,
        borderColor: "rgb(147, 51, 234)",
        tension: 0.4,
      },
      {
        label: "Peak Latency of Inbound Requests",
        data: peakLatencyInboundAtEachTimestamp,
        borderColor: "rgb(234, 51, 51)",
        tension: 0.4,
      },
      {
        label: "Peak Latency of Outbound Requests",
        data: peakLatencyOutboundAtEachTimestamp,
        borderColor: "rgb(51, 234, 51)",
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

Latency.propTypes = {
  defaultView: PropTypes.bool,
  clickedPod: PropTypes.string,
  latencyAppRequestHistorical: PropTypes.object,
};

export default Latency;
