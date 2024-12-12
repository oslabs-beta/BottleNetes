import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Pod from "./Pod";

// const PodGrid = (props) => {
//   const {
//     defaultView,
//     setDefaultView,
//     setClickedPod,
//     podStatuses,
//     requestLimits,
//     cpuUsageOneValue,
//     memoryUsageOneValue,
//     latencyAppRequestOneValue,
//   } = props;

const PodGrid = ({
  defaultView,
  setDefaultView,
  setClickedPod,
  podStatuses,
  requestLimits,
  cpuUsageOneValue,
  memoryUsageOneValue,
  latencyAppRequestOneValue,
}) => {
  // As buttons are clicked, displayedData state will be updated to hold the correct information
  // const [displayedData, setDisplayedData] = useState([]);

  const [selectedMetric, setSelectedMetric] = useState("cpu");

  // Loop over pod statuses and populate podList with pod names
  // const podList = [];
  // console.log(podStatuses);
  // for (const pod of podStatuses.allPodsStatus) {
  //   const podObj = {
  //     podName: pod.podName,
  //   };
  //   podList.push({ podName: pod.podName, color: "" });

  // }
  // // console.log("PodList:", podList)


  // podList.forEach((pod) => {
  //   // Search for the same pod by pod name in resourceUsageOneValue array of objects
  //   const cpuData = cpuUsageOneValue.resourceUsageOneValue.find(
  //     (item) => item.name === pod.podName,
  //   );
  //   if (cpuData) {
  //     pod.cpuUsageOneValue = cpuData.usageRelativeToRequest;
  //   }
  //   const memoryData = memoryUsageOneValue.resourceUsageOneValue.find(
  //     (item) => item.name === pod.podName,
  //   );
  //   if (memoryData) {
  //     pod.memoryUsageOneValue = memoryData.usageRelativeToRequest;
  //   }
  //   // const latencyData = latencyAppRequestOneValue.resourceUsageOneValue.find(
  //   //   (item) => item.name === pod.podName,
  //   // );
  //   // if (latencyData) {
  //   //   pod.latencyAppRequestOneValue = latencyData.usageRelativeToRequest;
  //   // }
  // });

  if (!podStatuses.allPodsStatus) {
    return <div>loading...</div>
  }

  const podList = podStatuses?.allPodsStatus?.map((pod) => {
    const podObj = {
      podName: pod.podName,
      status: pod.status,
      readiness: pod.readiness,
      containers: pod.containers,
      service: pod.service,
      selectedMetric,
    }
    if (selectedMetric === "cpu") {
      const cpuData = cpuUsageOneValue?.resourceUsageOneValue?.find(
        (obj) => obj.name === pod.podName
      );
      podObj.cpuData = cpuData?.usageRelativeToRequest;
    }
    if (selectedMetric === "memory") {
      const memoryData = memoryUsageOneValue?.resourceUsageOneValue?.find(
        (obj) => obj.name === pod.podName
      );
      podObj.memoryData = memoryData?.usageRelativeToRequest;
    }
    if (selectedMetric === "latency") {
      const latencyData = latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
        (obj) => obj.name === pod.podName
      );
      podObj.latencyData = latencyData?.avgCombinedLatency;
    }

    return podObj;
  })

  console.log(podList)

  // Update the color factor everytime the selectedMetric changes
  // useEffect(() => {
  //   const getColor = (value) => {
  //     // CSS linear gradient ranging from green (0) to red (1)
  //     return `linear-gradient(90deg, green ${value * 100}%, yellow ${value * 100}%, orange ${value * 100}%, red ${value * 100}%)`;
  //   };

  //   switch (selectedMetric) {
  //     case "cpu":
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.cpuData / 100);
  //       }
  //       break;
  //     case "memory":
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.memoryData / 100);
  //       }
  //       break;
  //     case "latency":
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.latencyData / 100);
  //       }
  //       break;
  //     default:
  //       for (let pod of podList) {
  //         pod.color = getColor(pod.cpuData / 100);
  //       }
  //       break;
  //   }
  // }, [selectedMetric]);

  return (
    <div id="pod-grid">
      {/* Render the grid of pods as a list */}
      <ul id="pod-list">
        {podList.map((pod, index) => (
          <li key={index} 
          style={{ backgroundColor: pod.color }}
          >
            <Pod               
              pod={pod}
              type="button" 
              onClick={() => {
                setClickedPod(pod.podName);
                setDefaultView(false);
              }}/>
          </li>
        ))}
      </ul>
      {/* Render the change metric buttons */}
      <div>
        <button onClick={() => setSelectedMetric("cpu")}>
          {"CPU Usage (%)"}
        </button>
        <button onClick={() => setSelectedMetric("memory")}>
          {"RAM Usage (%)"}
        </button>
        {/* <button onClick={() => setSelectedMetric("disk")}>
          {"Disk Usage (%)"}
        </button>
        <button onClick={() => setSelectedMetric("errorRate")}>
          {"Error Rate (%)"}
        </button> */}
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

PodGrid.propTypes = {
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
  setClickedPod: PropTypes.func.isRequired,
  podStatuses: PropTypes.shape({
    allPodsStatus: PropTypes.array,
  }),
  requestLimits: PropTypes.object,
  cpuUsageOneValue: PropTypes.object,
  memoryUsageOneValue: PropTypes.object,
  latencyAppRequestOneValue: PropTypes.object,
};

export default PodGrid;
