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
  // const [nodeData, setNodeData] = useState({
  //   OOMKills: 0,
  //   evictions: 0,
  //   failedScheduling: 0,
  // });
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
      const response = await fetch("http:/localhost:3000/errorrate", {
        method: "POST",
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
      });
      if (response.ok) {
        const data = await response.json();
        // RETURN RAW DATA, FORMAT FOR STATE ELSEWHERE
        return data;
      } else {
        const data = await response.json();
        console.error(data);
      }
    } catch (error) {
      console.log(error);
      alert("There is an error with your request. Could not fetch data");
    }
  };

  /* Example Requests:
   * 1. CPU usage over last 5 minutes:
   *    {
   *      "type": "cpu",
   *      "time": "5m"
   *    }
   *
   * 2. Maximum memory utilization over last hour:
   *    {
   *      "type": "memory",
   *      "time": "1h",
   *      "aggregation": "max"
   *    }
   *
   *  REQUEST BODY NEEDS
   *  {
   *   type: string,      // Required. Options: "cpu" | "memory"
   *   time: string,      // Required. Format: "{number}s" | "{number}m" | "{number}h"
   *                      // Examples: "15s", "5m", "1h"
   *   aggregation: string //  Options: "avg" | "sum" | "max" | "min"
   *      level: string       // Required. Options: "pod, namespace" | "namespace" | "pod" | "cluster"
   *  }
   */

  // 3 queries for the node, 4 queries for pod
  // query object needs to have t

  // REPLACE NODE NAME WITH THE NAME OF THE NODE, PROBABLY NEED TO PROP DRILL
  // FIND WAY TO INCLUDE TIME HERE SOMEHOW?
  const nodeQuery = {
    OOMKillsQuery:
      'count(kubernetes_events{reason="FailedScheduling", message=~"node=\\"${NODE_NAME}\\""})',
    evictionsQuery:
      'count(kubernetes_events{reason="Evicted", message=~"node=\\"${NODE_NAME}\\""})',
    failedSchedulingQuery:
      'count(kubernetes_events{reason="FailedScheduling", message=~"node=\\"${NODE_NAME}\\""})',
  };

  // ADD QUERIES HERE TO BE PASSED INTO THE BACKEND?
  const propQuery = {
    restartCountQuery: "kube_pod_container_status_restarts_total{pod=\"POD NAME HERE\"}",
    OOMKillsQuery: "kube_pod_container_status_terminated_reason{reason=\"OOMKilled\", pod=\"POD NAME HERE\"}",
    readinessFailuresQuery: "sum(kube_pod_container_status_ready == 0{pod = \"POD NAME HERE\"}) by (pod, namespace)",
    livenessFailuresQuery: "sum(kube_pod_container_status_liveness_probe_failed == 1{pod = \"POD NAME HERE\"}) by (pod, namespace)"
  };

  if (defaultView) {
    fetchData(nodeQuery);
    // SET NODE DATA STATE WITH QUERY RESULT
  } else {
    fetchData(propQuery);
    // SET POD DATA STATE WITH QUERY RESULT
  }

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
        data: [10, 50, 60],
        borderColor: "red",
      },
      {
        label: "Example 4",
        data: [10, 50, 60],
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
