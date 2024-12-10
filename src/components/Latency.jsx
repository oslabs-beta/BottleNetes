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



    // Use Effect to run fetch requests every time default view is toggled 
    // or a different pod is clicked into
    useEffect(() => {
      const getData = async () => {
        // NEED TO: add a conditional here to see if fetching node or pod data
        // if (defaultView) {
          console.log("FETCHING POD DATA");
          const queryResult = await fetchData(podQuery);
          console.log("DONE FETCHING DATA: ", queryResult);
        // }
        // else {
        //   console.log("DEFAULT VIEW IS FALSE")
        // }
      }
      getData();
    }, [defaultView, clickedPod]);



  // ADD QUERIES HERE TO BE PASSED INTO THE BACKEND?
  const podQuery = {
    inboundLatency: "sum(rate(istio_request_duration_milliseconds_sum{reporter=\"destination\"}[1h])) by (pod) /sum(rate(istio_request_duration_milliseconds_count{reporter=\"destination\"}[1h])) by (pod)",
    outboundLatency: "sum(rate(istio_request_duration_milliseconds_sum{reporter=\"source\"}[1h])) by (pod) /sum(rate(istio_request_duration_milliseconds_count{reporter=\"source\"}[1h])) by (pod)",
    peakLatency: "histogram_quantile(0.99,sum(rate(istio_request_duration_milliseconds_bucket{reporter=\"destination\"}[1h])) by (le, pod))",
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
