/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useState } from "react";
import Pod from "./Pod";

const PodGrid = ({
  defaultView,
  setDefaultView,
  setClickedPod,
  selectedMetric,
  setSelectedMetric,
  podStatuses,
  cpuUsageOneValue,
  memoryUsageOneValue,
  latencyAppRequestOneValue,
}) => {
  // As buttons are clicked, displayedData state will be updated to hold the correct information
  // const [displayedData, setDisplayedData] = useState([]);

  // moved to main container
  // const [selectedMetric, setSelectedMetric] = useState("cpu");

  if (!podStatuses.allPodsStatus) {
    return <div>loading...</div>;
  }

  // useEffect(() => {
  const podList = podStatuses?.allPodsStatus?.map((pod) => {
    const podObj = {
      podName: pod.podName,
      status: pod.status,
      readiness: pod.readiness,
      containers: pod.containers,
      service: pod.service,
      selectedMetric,
    };

    const cpuData = cpuUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.cpuData = cpuData?.usageRelativeToRequest;
    // podObj.value = cpuData?.usageRelativeToRequest;

    const memoryData = memoryUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.memoryData = memoryData?.usageRelativeToRequest;
    // podObj.value = memoryData?.usageRelativeToRequest;

    const latencyData =
      latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
        (obj) => obj.name === pod.podName,
      );
    podObj.latencyData = latencyData?.avgCombinedLatency;
    // podObj.value = latencyData?.avgCombinedLatency;

    return podObj;
  });
  // }, [selectedMetric, podStatuses])

  // console.log("PODLIST from grid", podList);

  const buttonArray = [];
  for (let i = 1; i < podList.length; i++) {
    // randomStatus();
    const podObj = podList[i];

    buttonArray.push(
      <Pod
        key={i}
        pod={podObj}
        type="button"
        selectedMetric={selectedMetric}
        onClick={() => {
          setClickedPod(podObj.podName);
          setDefaultView(false);
        }}
      />,
    );
  }

  const gridStyle =
    // "grid h-screen grid-cols-5 gap-0 overflow-scroll md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 xl-2xl:grid-cols-7 3xl:grid-cols-9";
    "grid gap-[2px] grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";
  return (
    <div className="isolation:isolate flex h-full overflow-visible">
      <div className="relative z-10 w-3/4 overflow-auto overflow-visible p-4">
        <div id="pod-grid" className={gridStyle}>
          {buttonArray}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Vertical gradient bar */}
        <div className="relative flex flex-col items-center">
          <div className="relative h-40 w-4 rounded-full bg-gradient-to-b from-red-500 via-yellow-300 to-green-400">
            <span className="absolute top-0 -mt-5 text-xs text-slate-900">
              100%
            </span>
            <span className="absolute bottom-0 -mb-5 text-xs text-slate-900">
              0%
            </span>
          </div>
        </div>

        <div className="flex w-1/4 min-w-[203px] max-w-[250px] flex-col justify-start gap-4 p-4">
          <p className="text-lg font-semibold text-slate-600">
            now showing: {selectedMetric}
          </p>
          <button
            onClick={() => setSelectedMetric("cpu")}
            className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-4 py-2 py-5 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
          >
            CPU Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("memory")}
            className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-4 py-2 py-5 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
          >
            Mem. Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("latency")}
            className="rounded-2xl bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] px-4 py-2 py-5 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
          >
            Latency (ms)
          </button>
        </div>
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
  selectedMetric: PropTypes.string.isRequired,
  setSelectedMetric: PropTypes.func.isRequired,
  podStatuses: PropTypes.shape({
    allPodsStatus: PropTypes.array,
  }),
  requestLimits: PropTypes.object,
  cpuUsageOneValue: PropTypes.object,
  memoryUsageOneValue: PropTypes.object,
  latencyAppRequestOneValue: PropTypes.object,
};

export default PodGrid;
