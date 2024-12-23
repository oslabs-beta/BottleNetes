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
  podRestartCount,
  setPodRestartCount,
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
  const [showRestartPopup, setShowRestartPopup] = useState(false);
  const [showPodLog, setShowPodLog] = useState(false);
  const [podLog, setPodLog] = useState("No logs available");

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
    setShowRestartPopup(true);
  };

  const handleViewPodLog = async () => {
    if (
      !clickedPod.podName ||
      !clickedPod.namespace ||
      !clickedPod.containers
    ) {
      alert("Please select a pod first");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/k8s/viewPodLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
          containers: clickedPod.containers,
        }),
      });
      const podLogs = await response.json();
      // console.log("Pod logs:", podLogs.logs);
      // console.log("type:", typeof podLogs.logs);
      setPodLog(podLogs.logs);
      setShowPodLog(true);
    } catch (error) {
      console.error("Error fetching pod logs:", error);
      alert(`Failed to fetch pod logs: ${error.message}`);
    }
  };

  const proceedRestartPod = async () => {
    try {
      const response = await fetch("http://localhost:3000/k8s/restartPod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
          containers: clickedPod.containers,
        }),
      });
      const data = await response.json();
      if (data.status === "success") {
        // alert("Pod restarted successfully");
        setPodRestartCount(podRestartCount + 1);
        setClickedPod({ podName: "", namespace: "", containers: [] });
      }
      // console.log("Response from server:", data);
    } catch (error) {
      console.error("Error restarting pod:", error);
      alert(`Failed to restart pod: ${error.message}`);
    } finally {
      setShowRestartPopup(false);
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
        key={podObj.podName}
        type="button"
        selectedMetric={selectedMetric}
        isClicked={
          clickedPod.podName === podObj.podName &&
          clickedPod.namespace === podObj.namespace &&
          clickedPod.containers === podObj.containers
        }
        onClick={() => {
          setClickedPod({
            podName: podObj.podName,
            namespace: podObj.namespace,
            containers: podObj.containers,
          });
          setDefaultView(false);
        }}
      />,
    );
  }

  const resetView = () => {
    setDefaultView(true);
    setClickedPod({ podName: "", namespace: "", containers: [] });
    setSelectedMetric("cpu");
  };

  const gridStyle =
    "grid gap-[2px] mr-2 mt-1 grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";
  return (
    <div className="flex h-full flex-col overflow-visible">
      <div id="control-buttons-row" className="mb-4 flex space-x-2 p-4">
        <button
          onClick={handleRestartPod}
          className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-slate-300 to-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
        >
          Restart Pod
        </button>

        <button
          onClick={handleViewPodLog}
          className="border-1 rounded-lg border-slate-200 bg-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
        >
          View Pod Log
        </button>

        <button
          className="border-1 rounded-lg border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          disabled
        >
          Modify Replicas
        </button>

        <button
          className="border-1 rounded-lg border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          disabled
        >
          Adjust Resources/Limits
        </button>
      </div>

      {/* Restart Confirmation Popup */}
      {showRestartPopup && (
        <div
          id="pod-restart-confirmation-popup"
          className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition duration-300 ${showRestartPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <div className="w-80 rounded-lg bg-slate-200 p-6 text-slate-800">
            <p>
              You will be restarting pod <strong>{clickedPod.podName}</strong>{" "}
              in namespace <strong>{clickedPod.namespace}</strong>.
              <br />
              This pod will be deleted, after that, another replica of this pod
              will be automatically created.
              <br />
              The process may take a few seconds to one minute.
              <br />
              Are you sure you want to proceed?
            </p>
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={proceedRestartPod}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Proceed
              </button>
              <button
                onClick={() => setShowRestartPopup(false)}
                className="rounded-lg bg-slate-600 px-4 py-2 text-slate-100 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pod Log Popup */}
      <div
        id="pod-log-popup"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${showPodLog ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="relative h-[80vh] w-[80vw] overflow-auto rounded-lg bg-slate-200 p-6">
          <pre className="whitespace-pre-wrap text-xs text-slate-900">
            {podLog}
          </pre>
          <button
            onClick={() => setShowPodLog(false)}
            className="fixed top-20 rounded-lg bg-red-500 px-4 py-2 text-slate-200 hover:bg-red-700 hover:text-slate-300"
          >
            Close Log
          </button>
        </div>
      </div>

      {/* Bottom Container */}
      <div className="flex flex-1">
        {/* Left Column - Selection Buttons */}
        <div
          id="selection-buttons-column"
          className="flex w-1/4 min-w-[207px] max-w-[250px] flex-col justify-start gap-4 p-4"
        >
          <div
            id="time-window-control"
            className="relative mb-4 flex items-center"
          >
            {/* button to open time window popup and reset time window of the query  */}
            <button
              onClick={() => setShowTimeWindow(true)}
              className="transition-color rounded-2xl border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 px-4 py-2 text-lg font-semibold text-slate-500 duration-300 hover:brightness-90"
            >
              Time Window: {queryTimeWindow}
            </button>

            <div
              id="time-window-tooltip-icon"
              className="group relative ml-2 cursor-help rounded-full bg-slate-300 px-2 py-0.5 text-sm font-bold text-slate-600"
            >
              ?
              <div
                id="time-window-tooltip-pop-up"
                className="pointer-events-none absolute left-1/2 top-0 z-[99999] mt-[-120px] w-64 -translate-x-1/2 rounded-lg bg-slate-200/95 p-4 text-xs text-slate-900/90 opacity-0 shadow-xl transition-opacity duration-300 group-hover:opacity-100"
              >
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
              </div>
            </div>
          </div>

          {/* Time Window Popup */}
          <div
            id="time-window-configuration-pop-up"
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${showTimeWindow ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <div className="rounded-lg bg-slate-200 p-6">
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
                    className="w-20 rounded border bg-slate-300 p-2 text-slate-800"
                    placeholder="Value"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value)}
                    className="rounded border bg-slate-300 p-2 text-slate-800"
                  >
                    <option value="s">Seconds</option>
                    <option value="m">Minutes</option>
                    <option value="h">Hours</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="rounded bg-blue-600 px-4 py-2 text-slate-100 hover:bg-blue-700"
                  >
                    Apply
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTimeWindow(false)}
                    className="rounded bg-slate-600 px-4 py-2 text-slate-100 hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>

          <button
            onClick={() => setSelectedMetric("cpu")}
            className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
              selectedMetric === "cpu"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 hover:brightness-90"
            }`}
          >
            CPU Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("memory")}
            className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
              selectedMetric === "memory"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 hover:brightness-90"
            }`}
          >
            Mem. Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("latency")}
            className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
              selectedMetric === "latency"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-200 to-slate-100 text-slate-500 transition hover:brightness-90"
            }`}
          >
            Latency (ms)
          </button>

          <button
            onClick={resetView}
            className={`rounded-2xl border-4 border-blue-600 bg-slate-100 px-2 py-4 text-lg font-semibold text-blue-600 transition duration-200 hover:bg-blue-600 hover:text-slate-100`}
          >
            Reset
          </button>
        </div>

        {/* Right Column - Pod Heat Map */}
        <div
          id="pod-heat-map"
          className="relative z-10 w-3/4 overflow-visible p-4"
        >
          <div id="pod-grid" className={gridStyle}>
            {buttonArray}
          </div>
        </div>
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
  podRestartCount: PropTypes.number,
  setPodRestartCount: PropTypes.func,
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
