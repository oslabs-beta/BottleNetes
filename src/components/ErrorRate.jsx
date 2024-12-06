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
  const mode = {}
  // conditionally start fetch requests here
  const fetchData = async (query) => {
    try {
      const response = await fetch("http:/localhost:3000/errorrate", {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      if (response.ok) {
        const data = await response.json();
        setOverviewData(data);
      } else {
        const data = await response.json();
        console.error(data);
      }
    } catch (error) {
      console.log(error);
      alert("There is an error with your request. Could not fetch data")
    }
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
