import PropTypes from "prop-types";
import { useState } from "react";

import Pod from "./Pod";
import PodRestart from "./PodRestart";
import PodLogDisplay from "./PodLogDisplay";
import QueryTimeWindowConfiguration from "./QueryTimeWindowConfiguration";
import PodGridMetricSelection from "./PodGridMetricSelection";

const PodGrid = ({
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
  backendUrl,
}) => {
  const [showReplicasPopup, setShowReplicasPopup] = useState(false);
  const [showRequestsLimitsPopup, setShowRequestsLimitsPopup] = useState(false);
  const [newReplicas, setNewReplicas] = useState(1);
  const [newRequests, setNewRequests] = useState("");
  const [newLimits, setNewLimits] = useState("");

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

  const proceedReplicas = async () => {
    console.log(`Sending request to '/k8s/replicas' endpoint...`);

    try {
      const response = await fetch("http://localhost:3000/k8s/replicas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
          containers: clickedPod.containers,
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
      alert(
        `${data.message}. Please wait until the page is refreshed for changes in the heatmap.`,
      );
    } catch (error) {
      console.error(`Could not send request: ${error}`);
      alert(`Failed to send request: ${error.message}`);
    } finally {
      setShowReplicasPopup(false);
    }
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

  // const resetView = () => {
  //   setDefaultView(true);
  //   setClickedPod({ podName: "", namespace: "", containers: [] });
  //   setSelectedMetric("cpu");
  // };

  const gridStyle =
    "grid gap-[2px] mr-2 mt-1 grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";
  return (
    <div className="flex h-full flex-col overflow-visible">
      <div id="control-buttons-row" className="mb-4 flex space-x-2 p-4">
        <PodRestart
          clickedPod={clickedPod}
          setClickedPod={setClickedPod}
          podRestartCount={podRestartCount}
          setPodRestartCount={setPodRestartCount}
          backendUrl={backendUrl}
        />

        <PodLogDisplay clickedPod={clickedPod} backendUrl={backendUrl} />

        {/* To be separated into a new component */}
        <button
          className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-slate-200 to-[#e8eef4] px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          onClick={handleReplicas}
        >
          Modify Replicas
        </button>

        {/* To be separated into a new component */}
        <button
          className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-[#e8eef4] to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
          onClick={handleRequestsLimits}
        >
          Adjust Resources/Limits
        </button>
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
        <div className="flex w-1/4 min-w-[207px] max-w-[250px] flex-col justify-start gap-4 p-4">
          <QueryTimeWindowConfiguration
            queryTimeWindow={queryTimeWindow}
            setQueryTimeWindow={setQueryTimeWindow}
          />

          <PodGridMetricSelection
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
          />

          {/* Left Side Buttons */}
          <button
            id="reset-button"
            onClick={() => {
              setDefaultView(true);
              setClickedPod({
                podName: "-",
                namespace: "-",
                containers: [],
                deployment: "-",
              });
              setSelectedMetric("cpu");
              setQueryTimeWindow("1m");
            }}
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
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
  clickedPod: PropTypes.shape({
    podName: PropTypes.string,
    namespace: PropTypes.string,
    containers: PropTypes.array,
    deployment: PropTypes.string,
  }).isRequired,
  setClickedPod: PropTypes.func.isRequired,
  selectedMetric: PropTypes.string.isRequired,
  setSelectedMetric: PropTypes.func.isRequired,
  podRestartCount: PropTypes.number.isRequired,
  setPodRestartCount: PropTypes.func.isRequired,
  podStatuses: PropTypes.shape({
    allPodsStatus: PropTypes.array,
  }),
  requestLimits: PropTypes.object,
  cpuUsageOneValue: PropTypes.object,
  memoryUsageOneValue: PropTypes.object,
  latencyAppRequestOneValue: PropTypes.object,
  queryTimeWindow: PropTypes.string.isRequired,
  setQueryTimeWindow: PropTypes.func.isRequired,
  backendUrl: PropTypes.string.isRequired,
};

export default PodGrid;
