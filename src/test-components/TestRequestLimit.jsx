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

const TestRequestLimit = () => {
  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: false,
      },
    },
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: `Request Limit for Pod`,
      },
    },
  };

  const data = {
    // basic stuff mostly taken from chartjs docs, I think it will need to be changed
    labels: ["Pod1", "Pod2", "Pod3", "Pod4", "Pod5"],
    datasets: [
      {
        label: "Request Rate",
        data: [15, 35, 80, 25, 37],
        backgroundColor: "rgba(102, 255, 141, 0.5)", //placeholder
      },
      {
        label: "Request Limit",
        data: [100, 100, 100, 100, 100],
        backgroundColor: "rgba(255, 104, 112, 0.5)",
        borderRadius: 50
      },
    ],
  };

  return (
    <div className='bg-zinc-800'>
      <Bar options={options} data={data} />
    </div>
  );
};

export default TestRequestLimit;

export const ScrollableBarChart = () => {
  const data = {
    labels: Array.from({ length: 50 }, (_, i) => `Label ${i + 1}`), // Example labels
    datasets: [
      {
        label: "Dataset",
        data: Array.from({ length: 50 }, () => Math.floor(Math.random() * 100) + 1),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        maxBarThickness: 30, // Control bar size
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: {
          autoSkip: false, // Ensure all labels are displayed
        },
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const chartWidth = data.labels.length * 50; // Adjust based on label count

  return (
    <div style={{ overflowX: "auto", height: "400px" }}>
      <div style={{ height: chartWidth }}>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};
