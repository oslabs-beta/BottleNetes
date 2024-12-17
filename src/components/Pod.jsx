/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import { useState } from "react";

const Pod = ({ pod, selectedMetric, onClick }) => {
  // console.log("pod", pod);
  const [isShowing, setIsShowing] = useState(false);

  const color = (value, minVal = 0, maxVal = 100) => {
    const normalizedValue = (value - minVal) / (maxVal - minVal);
    const r = 238 - Math.floor(normalizedValue * 204);
    console.log("red value: ", r);
    if (r) return `rgb(${r}, 197, 94)`;
    else
      return `#E0E0E0
`;
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

  const buttonStyle =
    // "relative m-0.5 aspect-square rounded-xl border-blue-600 brightness-90 transition hover:border-[5px] hover:filter"
    `m-[0.5px] relative aspect-square rounded-xl border-blue-600 brightness-90 transition hover:border-[5px] hover:filter ${isShowing ? "z-[9999]" : "z-0"}`;

  const hoverStyle =
    // "pointer-events-none absolute z-[99999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/80 p-2 text-sm text-slate-900/90 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 shadow-xl";
    `pointer-events-none absolute z-[99999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/80 text-slate-900/90 shadow-xl w-[300px] p-3 space-y-1 transition-opacity duration-700 ease-in-out ${isShowing ? "opacity-100" : "opacity-0"}`;

  if (pod.readiness == true) {
    return (
      <button
        className={buttonStyle}
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        onClick={onClick} // Add this handler
        style={{
          backgroundColor: pod.color,
        }}
      >
        {isShowing && (
          <div
            id="pod-info"
            // Added transition classes for fade in/out
            className={hoverStyle}
            // The group-hover:opacity-100 on the parent button is used to ensure smooth fade-in
          >
            <p className="font-semibold">
              Pod Name: <span className="font-normal">{pod.podName}</span>
            </p>
            <p className="font-semibold">
              Pod Status: <span className="font-normal">{pod.status}</span>
            </p>
            <p className="font-semibold">
              Containers: <span className="font-normal">{pod.containers}</span>
            </p>
            <p className="font-semibold">
              Service: <span className="font-normal">{pod.service}</span>
            </p>
            <p className="font-semibold">
              Ready?:{" "}
              <span className="font-normal">
                {pod.readiness ? "Yes" : "No"}
              </span>
            </p>
          </div>
        )}
      </button>
    );
  } else if (pod.readiness == false) {
    return (
      <button
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
      </button>
    );
  }
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
  onClick: PropTypes.func,
  selectedMetric: PropTypes.string,
};

export default Pod;
