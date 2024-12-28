/**
 * This component render 'View Pod Log' button with its Popups
 */

import PropTypes from "prop-types";
import { useState } from "react";

const PodLogDisplay = ({ clickedPod, backendUrl }) => {
  const [showPodLog, setShowPodLog] = useState(false);
  const [showContainerSelect, setShowContainerSelect] = useState(false);
  const [podLog, setPodLog] = useState("No logs available");
  // const [selectedContainer, setSelectedContainer] = useState("");

  const handleViewPodLog = async () => {
    if (
      !clickedPod.podName ||
      !clickedPod.namespace ||
      !clickedPod.containers
    ) {
      alert("Please select a pod first");
      return;
    }

    if (clickedPod.containers.length === 0) {
      alert("No containers found in this pod");
      return;
    }

    setShowContainerSelect(true);
  };

  const fetchContainerLogs = async (selectedContainer) => {
    console.log(`Sending request to '${backendUrl}k8s/viewPodLogs'...`);

    try {
      const response = await fetch(backendUrl + "k8s/viewPodLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          podName: clickedPod.podName,
          namespace: clickedPod.namespace,
          containers: clickedPod.containers,
          selectedContainer: selectedContainer,
        }),
      });
      const podLogs = await response.json();
      setPodLog(podLogs.logs);
      setShowContainerSelect(false);
      setShowPodLog(true);
    } catch (error) {
      console.error("Error fetching pod logs:", error);
      alert(`Failed to fetch pod logs: ${error.message}`);
    }
  };

  return (
    <div id="pod-log-display">
      <button
        onClick={handleViewPodLog}
        className="w-full rounded-lg border-2 border-slate-200 bg-gradient-to-br from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-105 active:brightness-90"
      >
        View Pod Log
      </button>

      {/* Container Selection Popup */}
      <div
        id="pod-log-viewr-container-select-popup"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${
          showContainerSelect
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div className="w-1/3 rounded-lg bg-slate-200 p-6">
          <h2 className="mb-4 text-center text-lg font-bold text-slate-800">
            Select A Container To View Logs
          </h2>
          <div id="container-select-buttons" className="flex flex-col gap-2">
            {clickedPod.containers.map((containerName) => (
              <button
                key={containerName}
                onClick={() => fetchContainerLogs(containerName)}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:brightness-110 active:brightness-90 transition duration-200"
              >
                {containerName}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowContainerSelect(false)}
            className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:brightness-110 active:brightness-90 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Log Display Popup */}
      <div
        id="pod-log-popup"
        className={`fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${
          showPodLog
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          id="pod-log-content"
          className="relative left-1/2 top-1/2 size-4/5 -translate-x-1/2 -translate-y-1/2 overflow-auto rounded-lg bg-slate-200 px-6 py-3"
        >
          <button
            onClick={() => setShowPodLog(false)}
            className="sticky left-full top-0 rounded-lg bg-red-500 px-4 py-2 text-slate-200 hover:brightness-110 active:brightness-90 transition duration-200"
          >
            Close Log
          </button>
          <pre className="absolute top-0 whitespace-pre-wrap text-xs text-slate-900">
            <br />
            {podLog}
            <br />
          </pre>
        </div>
      </div>
    </div>
  );
};

PodLogDisplay.propTypes = {
  clickedPod: PropTypes.shape({
    podName: PropTypes.string,
    namespace: PropTypes.string,
    containers: PropTypes.array,
  }).isRequired,
  backendUrl: PropTypes.string.isRequired,
};

export default PodLogDisplay;
