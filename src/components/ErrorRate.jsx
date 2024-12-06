import React from "react";
import { useEffect, useReducer } from "react";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

const ErrorRate = ({ defaultView, clickedPod }) => {

  // conditionally start fetch requests here
  const fetchData = async (mode) => {
    
  }

  const options = {};
  const mockData = {
    labels: ["A", "B", "C"],
    datasets: [
      {
        label: "Example 1",
        data: [3, 1, 5],
        borderColor: "blue",
      },
      {
        label: "Example 2",
        data: [10, 50, 60],
        borderColor: "red"
      }
    ]
  }
  return <Line options={options} data={mockData} />;
};

export default ErrorRate;
