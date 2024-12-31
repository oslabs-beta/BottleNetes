/**
 * This component render each pod in the heatmap with the popup when hovering over each pod
 */

import React from "react";

import mainStore from "../../stores/mainStore.ts";
import podStore from "../../stores/podStore.ts";
import { podObj } from "../../hooks/usePodListProcessor.ts";

interface PodProps {
  podInfo: podObj;
  onClick: () => void;
  isClicked: boolean;
}

const Pod = (props: PodProps) => {
  const { podInfo, onClick, isClicked } = props;
  const selectedMetric = mainStore((state) => state.selectedMetric);
  const { isShowing, setIsShowing } = podStore();

  // Determine the color for each pod based on the value of selected metric
  const color = (value: number | undefined, minVal = 0, maxVal = 100) => {
    if (value === undefined) return `#E0E0E0`;
    const normalizedValue = 1 - (value as number - minVal) / (maxVal - minVal);
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

  // Style for each pod in the heat map
  const buttonStyle = `m-[0.5px] relative aspect-square rounded-xl brightness-90 transition ${isShowing ? "z-[9999]" : "z-0"} ${isClicked ? "shadow-custom-lg border-[5px] border-blue-600" : "border-blue-600"} hover:border-[5px] hover:filter`;

  // Style for the tooltip
  const hoverStyle = `pointer-events-none absolute z-[99999] rounded-lg bg-slate-100/95 text-slate-900/90 shadow-xl w-[350px] p-3 space-y-1 transition-opacity duration-300 ${isShowing ? "opacity-100" : "opacity-0"}`;

  // If readiness is true then render this
  if (podInfo.readiness) {
    return (
      // Individual Pod
      <button
        className={buttonStyle}
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
        onClick={onClick}
        style={{
          backgroundColor: podInfo.color,
        }}
      >
        {/* Tooltip is contained inside each pod. Renders when hovering the mouse over each pod */}
        <div id="pod-info-ready" className={`${hoverStyle}`}>
          <p className="text-left font-semibold">
            Pod Name: <span className="font-normal">{podInfo.podName}</span>
          </p>
          <p className="text-left font-semibold">
            Namespace:
            <span className="font-normal">{podInfo.namespace}</span>
          </p>
          <hr className="border-1 my-0.5 border-gray-400" />
          <p className="text-left font-semibold">
            Pod Status: <span className="font-normal">{podInfo.status}</span>
          </p>
          <p className="text-left font-semibold">
            Ready:
            <span className="font-normal">
              {podInfo.readiness ? "Yes" : "No"}
            </span>
          </p>
          <hr className="border-1 my-0.5 border-gray-400" />
          <p className="text-left font-semibold">
            Deployment:{" "}
            <span className="font-normal">{podInfo.deploymentName}</span>
          </p>
          <p className="text-left font-semibold">
            Service: <span className="font-normal">{podInfo.service}</span>
          </p>
          <p className="text-left font-semibold">
            Containers:
            <span className="font-normal">{podInfo.containers.join(", ")}</span>
          </p>
          <hr className="border-1 my-0.5 border-gray-400" />
          <p className="text-left font-semibold">
            CPU Usage (% of request):{" "}
            <span className="font-normal">
              {podInfo.cpuDataRelative
                ? podInfo.cpuDataRelative.toFixed(2) + "%"
                : "N/A"}
            </span>
          </p>
          <p className="text-left font-semibold">
            RAM Usage (% of request):{" "}
            <span className="font-normal">
              {podInfo.memoryDataRelative
                ? podInfo.memoryDataRelative.toFixed(2) + "%"
                : "N/A"}
            </span>
          </p>
          <hr className="border-1 my-0.5 border-gray-400" />
          <p className="text-left font-semibold">
            CPU Usage (cpu cores):{" "}
            <span className="font-normal">
              {podInfo.cpuDataAbsolute
                ? podInfo.cpuDataAbsolute.toFixed(3)
                : "N/A"}
            </span>
          </p>
          <p className="text-left font-semibold">
            RAM Usage (MB):{" "}
            <span className="font-normal">
              {podInfo.memoryDataAbsolute
                ? (podInfo.memoryDataAbsolute / 1024 / 1024).toFixed(2)
                : "N/A"}
            </span>
          </p>
          <hr className="border-1 my-0.5 border-gray-400" />
          <p className="text-left font-semibold">
            CPU Request vs. Limit (cpu cores):{" "}
            <span className="font-normal">
              {podInfo.cpuRequest !== null || podInfo.cpuLimit !== null
                ? `${podInfo.cpuRequest} / ${podInfo.cpuLimit}`
                : "N/A"}
            </span>
          </p>
          <p className="text-left font-semibold">
            RAM Request vs. Limit (MB):{" "}
            <span className="font-normal">
              {podInfo.memoryRequest !== null || podInfo.memoryLimit !== null
                ? `${podInfo.memoryRequest} / ${podInfo.memoryLimit}`
                : "N/A"}
            </span>
          </p>
          <hr className="border-1 my-0.5 border-gray-400" />
        </div>
      </button>
    );
    // Otherwise render the pod with the red color
  } else {
    return (
      <button
        className="m-0.5 aspect-square rounded-xl border-blue-600 bg-[#db6451] transition hover:border-[5px] hover:filter"
        onMouseEnter={() => setIsShowing(true)}
        onMouseLeave={() => setIsShowing(false)}
      >
        <div id="pod-info-not-ready" className={`${hoverStyle}`}>
          <p>Pod Name: {podInfo.podName}</p>
          <p>Pod Status: {podInfo.status}</p>
          <p>Container in Pod: {podInfo.containers}</p>
          <p>Service in Pod: {podInfo.service}</p>
          <p>Active/Inactive: {podInfo.readiness}</p>
        </div>
      </button>
    );
  }
};

export default Pod;
