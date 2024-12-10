import React from "react";
import { useEffect, useReducer, useState } from "react";

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

const Latency = ({ defaultView, clickedPod, podData, setPodData, allData }) => {
  const nodeLatency = allData.latency;
  const podLatency = allData.latency;

  // TO TEST OUT GRAPH
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
        borderColor: "red",
      },
      {
        label: "Example 3",
        data: [10, 80, 60],
        borderColor: "red",
      },
      {
        label: "Example 4",
        data: [10, 0, 60],
        borderColor: "red",
      },
    ],
  };


  // Render node data if default view is true, pod data otherwise
  return (
    <div>
      {defaultView ? (
        <Line options={options} data={mockData} />
      ) : (
        <Line options={options} data={mockData} />
      )}
    </div>
  );
};

export default Latency;
