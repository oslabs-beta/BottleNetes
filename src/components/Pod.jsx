import PropTypes from "prop-types";
import { useState } from "react";

const Pod = ({ podInfo, selectedMetric, onClick, isClicked }) => {
  // console.log("podInfo", podInfo);
  const [isShowing, setIsShowing] = useState(false);

  const color = (value, minVal = 0, maxVal = 100) => {
    const normalizedValue = 1 - (value - minVal) / (maxVal - minVal);
    const r = 238 - Math.floor(normalizedValue * 204);

    if (r) return `rgb(${r}, 197, 94)`;
    else return `#E0E0E0`;
  };

  switch (selectedMetric) {
    case "cpu":
      podInfo.color = color(podInfo.cpuDataRelative);
      break;
    case "memory":
      podInfo.color = color(podInfo.memoryDataRelative);
      break;
    case "latency": {
      podInfo.color = color(podInfo.latencyData);
      break;
    }
    default: {
      podInfo.color = color(podInfo.cpuDataRelative);
      break;
    }
  }

  const buttonStyle =
    // "relative m-0.5 aspect-square rounded-xl border-blue-600 brightness-90 transition hover:border-[5px] hover:filter"
    `m-[0.5px] relative aspect-square rounded-xl brightness-90 transition ${isShowing ? "z-[9999]" : "z-0"} ${isClicked ? "shadow-custom-lg border-[5px] border-blue-600" : "border-blue-600"} hover:border-[5px] hover:filter`;

  const hoverStyle =
    // "pointer-events-none absolute z-[99999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/80 p-2 text-sm text-slate-900/90 opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 shadow-xl";
    `pointer-events-none absolute z-[99999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white/80 text-slate-900/90 shadow-xl w-[300px] p-3 space-y-1 transition-opacity duration-700 ease-in-out ${isShowing ? "opacity-100" : "opacity-0"}`;

  if (podInfo.readiness == true) {
    return (
      <button
        className={buttonStyle}
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        onClick={onClick}
        style={{
          backgroundColor: podInfo.color,
        }}
      >
        {isShowing && (
          <pod-info-popup id="pod-info" class={hoverStyle}>
            <p className="font-semibold">
              Pod Name: <span className="font-normal">{podInfo.podName}</span>
            </p>
            <p className="font-semibold">
              Pod Status: <span className="font-normal">{podInfo.status}</span>
            </p>
            <p className="font-semibold">
              Namespace:
              <span className="font-normal">{podInfo.namespace}</span>
            </p>
            <p className="font-semibold">
              Containers:
              <span className="font-normal">
                {podInfo.containers.join(", ")}
              </span>
            </p>
            <p className="font-semibold">
              Service: <span className="font-normal">{podInfo.service}</span>
            </p>
            <p className="font-semibold">
              Ready:
              <span className="font-normal">
                {podInfo.readiness ? "Yes" : "No"}
              </span>
            </p>
            <p className="font-semibold">
              CPU Usage (% of request):
              <span className="font-normal">
                {podInfo.cpuDataRelative
                  ? podInfo.cpuDataRelative.toFixed(2) + "%"
                  : "N/A"}
              </span>
            </p>
            <p className="font-semibold">
              RAM Usage (% of request):
              <span className="font-normal">
                {podInfo.memoryDataRelative
                  ? podInfo.memoryDataRelative.toFixed(2) + "%"
                  : "N/A"}
              </span>
            </p>
            <p className="font-semibold">
              CPU Usage (cpu cores):
              <span className="font-normal">
                {podInfo.cpuDataAbsolute
                  ? podInfo.cpuDataAbsolute.toFixed(3)
                  : "N/A"}
              </span>
            </p>
            <p className="font-semibold">
              RAM Usage (MB):
              <span className="font-normal">
                {podInfo.memoryDataAbsolute
                  ? (podInfo.memoryDataAbsolute / 1024 / 1024).toFixed(2)
                  : "N/A"}
              </span>
            </p>
          </pod-info-popup>
        )}
      </button>
    );
  } else if (podInfo.readiness == false) {
    return (
      <button
        className="m-0.5 aspect-square rounded-xl border-blue-600 bg-[#db6451] transition hover:border-[5px] hover:filter"
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
      >
        {isShowing && (
          <pod-info-popup id="pod-info">
            <p>Pod Name: {podInfo.podName}</p>
            <p>Pod Status: {podInfo.status}</p>
            <p>Container in Pod: {podInfo.containers}</p>
            <p>Service in Pod: {podInfo.service}</p>
            <p>Active/Inactive: {podInfo.readiness}</p>
          </pod-info-popup>
        )}
      </button>
    );
  }
};

Pod.propTypes = {
  podInfo: PropTypes.object,
  onClick: PropTypes.func,
  selectedMetric: PropTypes.string,
  isClicked: PropTypes.bool,
};

export default Pod;
