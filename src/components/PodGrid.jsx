import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Pod from "./Pod";

const PodGrid = (props) => {
  const {
    defaultView,
    setDefaultView,
    setClickedPod,
    podStatuses,
    requestLimits,
    cpuUsageOneValue,
    memoryUsageOneValue,
    latencyAppRequestOneValue,
  } = props;

  // As buttons are clicked, displayedData state will be updated to hold the correct information
  // const [displayedData, setDisplayedData] = useState([]);

  const [selectedMetric, setSelectedMetric] = useState("");

  // Loop over pod statuses and populate podList with pod names
  const podList = [];
  for (const pod of podStatuses.allPodsStatus) {
    podList.push({ podName: pod.podName, selectedMetric: "" });
  }

  podList.forEach((pod) => {
    // Search for the same pod by pod name in resourceUsageOneValue array of objects
    const cpuData = cpuUsageOneValue.resourceUsageOneValue.find(
      (item) => item.name === pod.podName,
    );
    if (cpuData) {
      // If there is a match (there should be one), add cpu data to the pod object
      pod.cpuUsageOneValue = cpuData.usageRelativeToRequest;
    }

    const memoryData = memoryUsageOneValue.resourceUsageOneValue.find(
      (item) => item.name === pod.podName,
    );
    if (memoryData) {
      pod.memoryUsageOneValue = memoryData.usageRelativeToRequest;
    }

    const latencyData = latencyAppRequestOneValue.resourceUsageOneValue.find(
      (item) => item.name === pod.podName,
    );
    if (memoryData) {
      pod.latencyAppRequestOneValue = latencyData.usageRelativeToRequest;
    }

  });

  // Will update the data to be displayed every time user selects another metric
  useEffect(() => {
    podList.forEach((pod) => {
      pod.selectedMetric = selectedMetric;
    });
  }, [selectedMetric]);

  return (
    <div id="pod-grid">
      {/* Render the grid of pods as a list */}
      <ul id="pod-list">
        {podList.map((pod, index) => (
          <li key={index}>
            <Pod
              metric={metric}
              pod={pod}
              type="button"
              setClickedPod={setClickedPod}
              fetchInfo={fetchInfo}
            />
          </li>
        ))}
      </ul>
      {/* Render the change metric buttons */}
      <div>
        <button onClick={() => setSelectedMetric("cpu")}>
          {"CPU Usage (%)"}{" "}
        </button>
        <button onClick={() => setSelectedMetric("memory")}>
          {"RAM Usage (%)"}
        </button>
        <button onClick={() => setSelectedMetric("disk")}>
          {"Disk Usage (%)"}
        </button>
        <button onClick={() => setSelectedMetric("errorRate")}>
          {"Error Rate (%)"}
        </button>
        <button onClick={() => setSelectedMetric("latency")}>
          {"Latency(ms)"}
        </button>
      </div>
    </div>
  );
};

PodGrid.propTypes = {
  setClickedPod: PropTypes.func,
  metric: PropTypes.string,
  setMetric: PropTypes.func,
  podData: PropTypes.array,
  setPodData: PropTypes.func,
};

export default PodGrid;
