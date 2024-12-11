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

const ErrorRate = ({ defaultView, clickedPod }) => {
  // STATE TO STORE NODE DATA
  const [nodeData, setNodeData] = useState({
    OOMKills: 0,
    evictions: 0,
    failedScheduling: 0,
  });
  // STATE TO STORE POD DATA
  // const [podData, setPodData] = useState({
  //   restartCount: 0,
  //   OOMKills: 0,
  //   readinessFailures: 0,
  //   livenessFailures: 0,
  // });

  // GENERIC FETCH REQUEST HELPER FUNCTION, REQUEST SENT IN BODY
  const fetchData = async (query) => {
    try {
      const response = await fetch("http://localhost:3000/errorrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      if (response.ok) {
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

  const nodeQuery = {
    OOMKillsQuery: 'increase(kubernetes_events{reason="OOMKilled"}[1h])',
    evictionsQuery: 'increase(kubernetes_events{reason="Evicted"}[1h])',
    failedSchedulingQuery:
      'increase(kubernetes_events{reason="FailedScheduling"}[1h])',
    totalErrorRate: "sum(rate(kubelet_runtime_operations_errors_total[1h]))",
  };


    // Use Effect to run fetch requests every time default view is toggled 
    // or a different pod is clicked into
    useEffect(() => {
      const getData = async () => {
        if (defaultView) {
          // need to cleaar and set intervals to get live data?
          console.log("DEFAULT VIEW IS TRUE, FETCHING NODE DATA");
          const queryResult = await fetchData(nodeQuery);
          setNodeData(queryResult);
          console.log("DONE FETCHING NODE DATA: ", queryResult);
        }
        else {
          console.log("DEFAULT VIEW IS FALSE")
        }
      }
      getData();
    }, [defaultView, clickedPod]);



  // ADD QUERIES HERE TO BE PASSED INTO THE BACKEND?
  // const propQuery = {
  // //   restartCountQuery:
  // //     'kube_pod_container_status_restarts_total{pod="POD NAME HERE"}',
  // //   OOMKillsQuery:
  // //     'kube_pod_container_status_terminated_reason{reason="OOMKilled", pod="POD NAME HERE"}',
  // //   readinessFailuresQuery:
  // //     'sum(kube_pod_container_status_ready == 0{pod = "POD NAME HERE"}) by (pod, namespace)',
  // //   livenessFailuresQuery:
  // //     'sum(kube_pod_container_status_liveness_probe_failed == 1{pod = "POD NAME HERE"}) by (pod, namespace)',
  // };
  // console.log(nodeQuery)
  







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

export default ErrorRate;