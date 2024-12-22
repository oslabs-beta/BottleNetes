/* eslint-disable no-unused-vars */
import PropTypes from "prop-types";
import { useState } from "react";
import Pod from "./Pod";

const PodGrid = ({
  defaultView,
  setDefaultView,
  clickedPod,
  setClickedPod,
  selectedMetric,
  setSelectedMetric,
  podStatuses,
  cpuUsageOneValue,
  memoryUsageOneValue,
  latencyAppRequestOneValue,
  queryTimeWindow,
  setQueryTimeWindow,
  showTimeWindow,
  setShowTimeWindow,
  timeInput,
  setTimeInput,
  timeUnit,
  setTimeUnit,
  showTooltip,
  setShowTooltip,
}) => {
  const handleTimeWindowSubmit = (e) => {
    e.preventDefault();
    const value = parseInt(timeInput);
    if (value && value > 0) {
      setQueryTimeWindow(`${value}${timeUnit}`);
      setShowTimeWindow(false);
      setTimeInput("");
    }
  };

  const handleRestartPod = async () => {
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/k8s/restartPod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
        }),
      });
      if (!response.ok) throw new Error("Failed to restart pod");
      alert("Pod restart initiated");
    } catch (error) {
      console.error("Error restarting pod:", error);
      alert("Failed to restart pod");
    }
  };

  if (!podStatuses.allPodsStatus) {
    return <div>loading...</div>;
  }

  const podList = podStatuses?.allPodsStatus?.map((pod) => {
    const podObj = {
      podName: pod.podName,
      namespace: pod.namespace,
      status: pod.status,
      readiness: pod.readiness,
      containers: pod.containers,
      service: pod.service,
      selectedMetric,
    };

    const cpuData = cpuUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.cpuDataRelative = cpuData?.usageRelativeToRequest;
    podObj.cpuDataAbsolute = cpuData?.usageAbsolute;

    const memoryData = memoryUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.memoryDataRelative = memoryData?.usageRelativeToRequest;
    podObj.memoryDataAbsolute = memoryData?.usageAbsolute;

    const latencyData =
      latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
        (obj) => obj.name === pod.podName,
      );
    podObj.latencyData = latencyData?.avgCombinedLatency;

    return podObj;
  });

  // console.log("PODLIST from grid", podList);

  const buttonArray = [];
  for (const podObj of podList) {
    buttonArray.push(
      <Pod
        podInfo={podObj}
        type="button"
        selectedMetric={selectedMetric}
        isClicked={
          clickedPod.podName === podObj.podName &&
          clickedPod.namespace === podObj.namespace
        }
        onClick={() => {
          setClickedPod({
            podName: podObj.podName,
            namespace: podObj.namespace,
          });
          setDefaultView(false);
        }}
      />,
    );
  }

  const resetView = () => {
    setDefaultView(true);
    setClickedPod("");
    setSelectedMetric("cpu");
  };

  const gridStyle =
    "grid gap-[2px] mr-2 mt-1 grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";
  return (
    <div className="flex h-full flex-col overflow-visible">
      <control-buttons-row class="mb-4 flex space-x-2 p-4">
        <button
          onClick={handleRestartPod}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Restart Pod
        </button>
        <button
          className="rounded-lg bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          disabled
        >
          Scale
        </button>
        <button
          className="rounded-lg bg-slate-600 px-3 py-2 text-sm font-medium text-white hover:bg-slate-700"
          disabled
        >
          Configure
        </button>
      </control-buttons-row>

      {/* Bottom Container */}
      <div className="flex flex-1">
        {/* Left Column - Selection Buttons */}
        <selection-buttons-column class="flex w-1/4 min-w-[207px] max-w-[250px] flex-col justify-start gap-4 p-4">
          <time-window-contorl class="relative mb-4 flex items-center">
            {/* button to open time window popup and reset time window of the query  */}
            <button
              onClick={() => setShowTimeWindow(true)}
              className="rounded-2xl px-4 py-2 text-lg font-semibold text-slate-500 hover:bg-slate-200"
            >
              Time Window: {queryTimeWindow}
            </button>

            <time-window-tooltip-icon class="group relative ml-2 cursor-help rounded-full bg-slate-300 px-2 py-0.5 text-sm font-bold text-slate-600">
              ?
              <time-window-tooltip-pop-up class="pointer-events-none absolute left-1/2 top-0 z-[99999] mt-[-120px] w-64 -translate-x-1/2 rounded-lg bg-white/80 p-4 text-xs text-slate-900/90 opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100">
                <p>
                  Select a time window that best suits your monitoring needs:
                </p>
                <ul className="mt-2 list-disc pl-4">
                  <li>
                    Short (e.g., 30s, 1m): More responsive, real-time metrics
                  </li>
                  <li>Medium (e.g., 5m, 10m): Balanced view of pod behavior</li>
                  <li>
                    Long (e.g., 30m, 1h): Statistical average of pod performance
                  </li>
                </ul>
              </time-window-tooltip-pop-up>
            </time-window-tooltip-icon>
          </time-window-contorl>

          {/* Time Window Popup */}
          {showTimeWindow && (
            <time-window-configuration-pop-up class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="rounded-lg bg-slate-800 p-6">
                <form
                  onSubmit={handleTimeWindowSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      value={timeInput}
                      onChange={(e) => setTimeInput(e.target.value)}
                      className="w-20 rounded border bg-slate-700 p-2 text-white"
                      placeholder="Value"
                    />
                    <select
                      value={timeUnit}
                      onChange={(e) => setTimeUnit(e.target.value)}
                      className="rounded border bg-slate-700 p-2 text-white"
                    >
                      <option value="s">Seconds</option>
                      <option value="m">Minutes</option>
                      <option value="h">Hours</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                    >
                      Apply
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowTimeWindow(false)}
                      className="rounded bg-slate-600 px-4 py-2 text-white hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </time-window-configuration-pop-up>
          )}

          <button
            onClick={() => setSelectedMetric("cpu")}
            className={`rounded-2xl px-4 py-5 text-lg font-semibold transition-colors duration-200 ${
              selectedMetric === "cpu"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 hover:brightness-90"
            }`}
          >
            CPU Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("memory")}
            className={`rounded-2xl px-4 py-5 text-lg font-semibold transition-colors duration-200 ${
              selectedMetric === "memory"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 hover:brightness-90"
            }`}
          >
            Mem. Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("latency")}
            className={`rounded-2xl px-4 py-5 text-lg font-semibold transition-colors duration-200 ${
              selectedMetric === "latency"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 transition hover:brightness-90"
            }`}
          >
            Latency (ms)
          </button>

          <button
            onClick={resetView}
            className={`rounded-2xl border-4 border-blue-600 bg-slate-100 px-4 py-5 text-lg font-semibold text-blue-600 transition-colors duration-200 hover:brightness-90`}
          >
            Reset
          </button>
        </selection-buttons-column>

        {/* Right Column - Pod Heat Map */}
        <pod-heat-map class="relative z-10 w-3/4 overflow-visible p-4">
          <div id="pod-grid" className={gridStyle}>
            {buttonArray}
          </div>
        </pod-heat-map>
      </div>
    </div>
  );
};

PodGrid.propTypes = {
  clickedPod: PropTypes.object,
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
  queryTimeWindow: PropTypes.string.isRequired,
  setQueryTimeWindow: PropTypes.func.isRequired,
  showTimeWindow: PropTypes.bool.isRequired,
  setShowTimeWindow: PropTypes.func.isRequired,
  timeInput: PropTypes.string.isRequired,
  setTimeInput: PropTypes.func.isRequired,
  timeUnit: PropTypes.string.isRequired,
  setTimeUnit: PropTypes.func.isRequired,
  showTooltip: PropTypes.bool.isRequired,
  setShowTooltip: PropTypes.func.isRequired,
};

export default PodGrid;
