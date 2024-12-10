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

const Latency = ({ defaultView, clickedPod }) => {
  // STATE TO STORE NODE DATA
  // const [nodeData, setNodeData] = useState({
  //   peakLatency: [],
  //   inboundLatency: [],
  //   outboundLatency:[]
  // });
  // STATE TO STORE POD DATA
  const [podData, setPodData] = useState({
    peakLatency: [],
    inboundLatency: [],
    outboundLatency:[]
  });

  // GENERIC FETCH REQUEST HELPER FUNCTION, REQUEST SENT IN BODY
  const fetchData = async (query) => {
    try {
      const response = await fetch("http://localhost:3000/latency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      if (response.ok && response != null) {
        console.log(response)
        const data = await response.json();
        return data;
      } else {
        const data = await response.json();
        console.error(data);
      }
    } catch (error) {
      console.log(error);
      // alert("There is an error with your request. Could not fetch data");
    }
  };




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

  return (
    <div>
      <Line options={options} data={mockData} />;
    </div>
  );
};

export default Latency;
