/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useState } from "react";

const Pod = ({
  pod,
  selectedMetric,
  // onClick
}) => {
  // // const { metric, pod, fetchInfo, setClickedPod } = props;
  // const [isShowing, setIsShowing] = useState(false);

  // // function to normalize metric value and return rgb color

  // const getColor = (value, minVal = 0, maxVal = 100) => {
  //   const numValue = parseInt(value);
  //   if (isNaN(numValue)) return "red";
  //   // if (!active) return "transparent"
  //   // if (readiness == "false") return "red";

  //   const normalizedValue = (numValue - minVal) / (maxVal - minVal);
  //   const r = Math.floor(normalizedValue * 255);

  //   return `rgb(${r}, 255, 0)`;
  // };

  // const getColor = (value) => {
  //   // CSS linear gradient ranging from green (0) to red (1)
  //   return `linear-gradient(90deg, green ${value * 100}%, yellow ${value * 100}%, orange ${value * 100}%, red ${value * 100}%)`;
  // };

  // switch (selectedMetric) {
  //   case "cpu":
  //     pod.color = getColor(pod.cpuData / 100);
  //     break;
  //   case "memory":
  //     pod.color = getColor(pod.memoryData / 100);
  //     break;
  //   case "latency":
  //     pod.color = getColor(pod.latencyData / 100);
  //     break;
  //   default:
  //     pod.color = getColor(pod.cpuData / 100);
  //     break;
  // }

  // const getColor = (value) => {
  //   if (value <= 0) return "green";
  //   if (value >= 1) return "red";

  //   // Or if you want the indicator to move along the gradient based on value:
  //   return `linear-gradient(90deg,
  //     green 0%,
  //     #4ade80 ${value * 100}%,
  //     #ef4444 ${value * 100}%,
  //     #ef4444 100%)`;
  // };
  console.log("pod", pod); 
  const [isShowing, setIsShowing] = useState(false);

  const color = (value, minVal = 0, maxVal = 100) => {
    const normalizedValue =  (value - minVal) / (maxVal - minVal);
    const r =  238 - Math.floor(normalizedValue * 204);
    console.log('red value: ', r);
    if (r) return `rgb(${r}, 197, 94)`
    else return `#1e293b`
  };

  switch (selectedMetric) {
    case "cpu":
      pod.color = color(pod.cpuData);
      break;
    case "memory":
      pod.color = color(pod.memoryData);
      break;
    case "latency": {
      pod.color = color(pod.latencyData);
      break;
    }
    default: {
      pod.color = color(pod.cpuData);
      break;
    }
  }
  // console.log(pod.color);
  console.log("cpu", pod.cpuData);
  console.log("color", pod.color);
  if (pod.readiness == true) {
    return (
      <button
        className="relative m-0.5 aspect-square rounded-xl border-blue-600 brightness-90 transition hover:border-[5px] hover:filter"
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        style={{
          backgroundColor: pod.color,
        }}
      >
        {isShowing && ( // Pop up appear on hover for every pod
          <div id="pod-info" className="absolute top-[-100%] left-1/2">
            <p>Pod Name: {pod.podName}</p>
            <p>Pod Status: {pod.status}</p>
            <p>Container in Pod: {pod.containers}</p>
            <p>Service in Pod: {pod.service}</p>
            <p>Active/Inactive: {pod.readiness}</p>
          </div>
        )}
      </button>
    );
  } else if (pod.readiness == false) {
    return (
      <div
        className="m-0.5 aspect-square rounded-xl border-blue-600 bg-[#db6451] transition hover:border-[5px] hover:filter"
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
      >
        {isShowing && ( // Pop up appear on hover for every pod
          <div id="pod-info">
            <p>Pod Name: {pod.podName}</p>
            <p>Pod Status: {pod.status}</p>
            <p>Container in Pod: {pod.containers}</p>
            <p>Service in Pod: {pod.service}</p>
            <p>Active/Inactive: {pod.readiness}</p>
          </div>
        )}
      </div>
    );
  }

  // return (
  //   <div
  //     id="pod"
  //     className="w-24 h-24"
  //     onMouseEnter={() => setIsShowing(true)}
  //     onMouseLeave={() => setIsShowing(false)}
  //     // onClick={onClick}
  //     style={{
  //       // backgroundColor: pod.color,
  //       backgroundColor: pod.color,
  //     }}
  //   >
  //     {isShowing && ( // Pop up appear on hover for every pod
  //       <div id="pod-info">
  //         <p>Pod Name: {pod.podName}</p>
  //         <p>Pod Status: {pod.status}</p>
  //         <p>Container in Pod: {pod.containers}</p>
  //         <p>Service in Pod: {pod.service}</p>
  //         <p>Active/Inactive: {pod.readiness}</p>
  //       </div>
  //     )}
  //   </div>
  // );
};
// return (
//   <div>
//     <p>Hi</p>
//   </div>
// );
// };

Pod.propTypes = {
  metric: PropTypes.string,
  pod: PropTypes.object,
  fetchInfo: PropTypes.func,
  setClickedPod: PropTypes.func,
};

export default Pod;

/*
import React, { useState } from "react";
import PropTypes from "prop-types";

const Pod = ({ pod, selectedMetric }) => {
  const [isShowing, setIsShowing] = useState(false);

  const getColor = (value) => {
    // Handle undefined or null values
    if (value === undefined || value === null) return "#gray";
    
    // Clamp value between 0 and 1
    const clampedValue = Math.min(Math.max(value, 0), 1);
    
    // Return solid colors for edge cases
    if (clampedValue <= 0) return "#4ade80"; // light green
    if (clampedValue >= 1) return "#ef4444"; // light red
    
    // Create dynamic gradient based on value
    return `linear-gradient(90deg,
      #4ade80 0%,
      #4ade80 ${(1 - clampedValue) * 100}%,
      #ef4444 ${(1 - clampedValue) * 100}%,
      #ef4444 100%)`;
  };

  const calculateMetricValue = () => {
    let value = 0;
    
    switch (selectedMetric) {
      case "cpu":
        value = pod.cpuData / 100;
        break;
      case "memory":
        value = pod.memoryData / 100;
        break;
      case "latency":
        value = pod.latencyData / 100;
        break;
      default:
        value = pod.cpuData / 100;
    }
    
    return Math.min(Math.max(value || 0, 0), 1);
  };

  const metricValue = calculateMetricValue();
  const backgroundColor = getColor(metricValue);

  return (
    <div
      className="relative w-24 h-24 rounded-lg shadow-md transition-all duration-200 hover:shadow-lg cursor-pointer"
      onMouseEnter={() => setIsShowing(true)}
      onMouseLeave={() => setIsShowing(false)}
      style={{ background: backgroundColor }}
    >
      {isShowing && (
        <div className="absolute z-10 p-4 bg-white rounded-lg shadow-lg -top-2 left-full ml-2 w-64">
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Pod Name: <span className="font-normal">{pod.podName}</span></p>
            <p className="font-semibold">Status: <span className="font-normal">{pod.status}</span></p>
            <p className="font-semibold">Containers: <span className="font-normal">{pod.containers}</span></p>
            <p className="font-semibold">Service: <span className="font-normal">{pod.service}</span></p>
            <p className="font-semibold">Active: <span className="font-normal">{pod.readiness ? "Yes" : "No"}</span></p>
            <p className="font-semibold">
              {selectedMetric.toUpperCase()}: 
              <span className="font-normal"> {(metricValue * 100).toFixed(1)}%</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

Pod.propTypes = {
  pod: PropTypes.shape({
    podName: PropTypes.string,
    status: PropTypes.string,
    containers: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    service: PropTypes.string,
    readiness: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    cpuData: PropTypes.number,
    memoryData: PropTypes.number,
    latencyData: PropTypes.number,
  }).isRequired,
  selectedMetric: PropTypes.oneOf(['cpu', 'memory', 'latency']).isRequired,
};

export default Pod;
*/
