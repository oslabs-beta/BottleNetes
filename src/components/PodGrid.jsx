import PropTypes from "prop-types";
import { useState } from "react";
import Pod from "./Pod";

const PodGrid = ({
  // defaultView,
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
  // showTooltip,
  // setShowTooltip,
}) => {
  const [showPodLog, setShowPodLog] = useState(false);
  const [podLog, setPodLog] = useState("No logs available");
  const [showRestartPopup, setShowRestartPopup] = useState(false);
  const [showReplicasPopup, setShowReplicasPopup] = useState(false);
  const [showRequestsLimitsPopup, setShowRequestsLimitsPopup] = useState(false);
  const [newReplicas, setNewReplicas] = useState(1);
  const [newRequests, setNewRequests] = useState("");
  const [newLimits, setNewLimits] = useState("");

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
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }

    console.log("Sending request to '/k8s/viewPodLogs' endpoint...");

    try {
      const response = await fetch('http://localhost:3000/k8s/viewPodLogs', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
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

  const handleReplicas = async () => {
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }
    setShowReplicasPopup(true);
  };

  const handleRequestsLimits = async () => {
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }
    setShowRequestsLimitsPopup(true);
  };

  const proceedRestartPod = async () => {
    console.log("Sending Request to '/k8s/restartPod' endpoint...");

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
      const data = await response.json();
      if (data.status === "success") {
        setPodRestartCount(podRestartCount + 1);
        setClickedPod({ podName: "", namespace: "" });
      }
      // console.log("Response from server:", data);
    } catch (error) {
      console.error("Error restarting pod:", error);
      alert(`Failed to restart pod: ${error.message}`);
    } finally {
      setShowRestartPopup(false);
    }
  };

  const proceedReplicas = async () => {
    console.log(`Sending request to '/k8s/replicas' endpoint...`);

    try {
      const response = await fetch("http://localhost:3000/k8s/replicas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
          newReplicas,
        }),
      });

      const data = await response.json();

      if (data.status !== "success") {
        console.error(
          `Unable to handle request to '/k8s/replicas' endpoint: ${data}`,
        );
        alert("Unable to handle request...");
      }

      console.log(data.data);
      alert(`${data.message}. Please wait until the page is refreshed for changes in the heatmap.`);

    } catch (error) {
      console.error(`Could not send request: ${error}`);
      alert(`Failed to send request: ${error.message}`);
    } finally {
      setShowReplicasPopup(false);
    }
  };

  const cancelRestartPod = () => {
    setShowRestartPopup(false);
  };

  const cancelReplicas = () => {
    setShowReplicasPopup(false);
  };

  const cancelRequestsLimits = () => {
    setShowRequestsLimitsPopup(false);
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
    setClickedPod({ podName: "", namespace: "" });
    setSelectedMetric("cpu");
  };

  const gridStyle =
    "grid gap-[2px] mr-2 mt-1 grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";
  return (
    <div className="flex h-full flex-col overflow-visible">
      <div id="control-buttons-row" className="mb-4 flex space-x-2 p-4">
        <button
          onClick={handleRestartPod}
          className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-slate-300 to-[#d6dee8] px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
        >
          Restart Pod
        </button>

        <button
          onClick={handleViewPodLog}
          className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-[#d6dee8] to-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
        >
          View Pod Log
        </button>

        <button
          className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-slate-200 to-[#e8eef4] px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          onClick={handleReplicas}
        >
          Modify Replicas
        </button>

        <button
          className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-[#e8eef4] to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          onClick={handleRequestsLimits}
        >
          Adjust Resources/Limits
        </button>
      </div>

      {/* Restart Confirmation Popup */}
      <div
        id="pod-restart-confirmation-popup"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition duration-300 ${showRestartPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="w-80 rounded-lg bg-slate-200 p-6 text-slate-800">
          <p>
            You will be restarting pod <strong>{clickedPod.podName}</strong>.
          </p>
          <br />
          <p>
            This pod will be deleted and another pod replica will be
            automatically created.
          </p>
          <div className="mt-4 flex justify-evenly space-x-2">
            <button
              onClick={proceedRestartPod}
              className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Proceed
            </button>
            <button
              onClick={cancelRestartPod}
              className="rounded-lg bg-slate-600 px-4 py-2 text-slate-100 hover:bg-slate-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

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

      {/* Replicas Popup */}
      <div
        id="replicas-popup"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition duration-300 ${showReplicasPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="w-1/6 rounded-lg bg-slate-200 p-6 text-center text-slate-800">
          <h2>Enter the amount of replicas for the designated Deployment</h2>
          <br />
          <div className="border-1 rounded-xl border-slate-300 bg-slate-300 p-4 text-left">
            <p>
              Selected Pod: <strong>{clickedPod.podName}</strong>
            </p>
            <p>
              Deployment: <strong>{clickedPod.deployment}</strong>
            </p>
          </div>
          <input
            value={newReplicas}
            type="number"
            onChange={(e) => setNewReplicas(e.target.value)}
            className="my-6 w-full rounded-lg bg-slate-300 p-2 text-slate-800 focus:bg-slate-400"
          />
          <div
            id="button-container"
            className="mb-5 flex flex-1 justify-around"
          >
            <button
              className="rounded-lg bg-slate-600 px-8 py-2 text-slate-100 hover:bg-slate-700"
              onClick={proceedReplicas}
            >
              Apply
            </button>
            <button
              className="rounded-lg bg-slate-600 px-8 py-2 text-slate-100 hover:bg-slate-700"
              onClick={cancelReplicas}
            >
              Cancel
            </button>
          </div>
          <div
            id="caution-display"
            className="rounded-xl border-2 border-orange-200 bg-orange-100 px-4 py-8"
          >
            <h3 className="text-xl text-red-700">
              <strong>CAUTION</strong>
            </h3>
            <br />
            <h4 className="text-left text-red-600">
              - The value must be greater than 1.
            </h4>
            <h4 className="text-left text-red-600">
              - DO NOT make any adjustments for any components inside Master
              Node as they can cause unwanted behaviors.
            </h4>
          </div>
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
              className="transition-color rounded-2xl border-slate-100 bg-gradient-to-r from-slate-300 to-slate-200 px-4 py-2 text-lg font-semibold text-slate-500 duration-300 hover:brightness-90"
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

          {/* Left Side Buttons */}
          <button
            onClick={() => setSelectedMetric("cpu")}
            className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
              selectedMetric === "cpu"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-300 to-slate-200 text-slate-500 hover:brightness-90"
            }`}
          >
            CPU Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("memory")}
            className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
              selectedMetric === "memory"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-300 to-slate-200 text-slate-500 hover:brightness-90"
            }`}
          >
            Mem. Usage (%)
          </button>
          <button
            onClick={() => setSelectedMetric("latency")}
            className={`rounded-2xl px-2 py-4 text-lg font-semibold transition duration-200 ${
              selectedMetric === "latency"
                ? "border-2 border-[#2563eb] bg-gradient-to-r from-[#1d4ed8] to-[#2563eb] text-slate-100 hover:brightness-90"
                : "border-2 border-slate-100 bg-gradient-to-r from-slate-300 to-slate-200 text-slate-500 transition hover:brightness-90"
            }`}
          >
            Latency (ms)
          </button>

          <button
            onClick={resetView}
            className="rounded-2xl border-4 border-blue-600 bg-gradient-to-r from-slate-200 to-slate-100 px-2 py-4 text-lg font-semibold text-blue-600 transition duration-200 hover:border-2 hover:bg-gradient-to-r hover:from-[#1d4ed8] hover:to-[#2563eb] hover:text-slate-100"
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
