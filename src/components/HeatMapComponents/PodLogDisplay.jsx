/**
 * This component render 'View Pod Log' button with its Popups
 */

import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

const PodLogDisplay = ({ clickedPod, backendUrl }) => {
  // State to determine the visibility of the log popup
  const [showPodLog, setShowPodLog] = useState(false);
  // State to determine the visibility of the initial popup to select container to show its log
  const [showContainerSelect, setShowContainerSelect] = useState(false);
  const [podLog, setPodLog] = useState("No logs available");
  const [selectedContainer, setSelectedContainer] = useState("");
  const logContentRef = useRef(null);

  // Scroll to bottom when log content updates
  useEffect(() => {
    if (logContentRef.current && showPodLog) {
      logContentRef.current.scrollTop = logContentRef.current.scrollHeight;
    }
  }, [podLog, showPodLog]);

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

  const fetchContainerLogs = async (containerName) => {
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
          selectedContainer: containerName,
        }),
      });
      const podLogs = await response.json();
      setPodLog(podLogs.logs);
      setSelectedContainer(containerName);
      setShowContainerSelect(false);
      setShowPodLog(true);
    } catch (error) {
      console.error("Error fetching pod logs:", error);
      alert(`Failed to fetch pod logs: ${error.message}`);
    }
  };

  const handleRefreshLogs = () => {
    if (selectedContainer) {
      fetchContainerLogs(selectedContainer);
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
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:brightness-110 active:brightness-90"
              >
                {containerName}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowContainerSelect(false)}
            className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-white transition duration-200 hover:brightness-110 active:brightness-90"
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Log Display Popup */}
      <div
        id="pod-log-popup"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300 ${
          showPodLog
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <div
          id="pod-log-content"
          ref={logContentRef}
          className="relative h-4/5 w-4/5 overflow-auto rounded-lg bg-slate-200 p-6"
        >
          <div className="sticky top-0 z-10 flex justify-end">
            <div className="inline-block rounded-lg bg-slate-200 px-2">
              <button
                onClick={handleRefreshLogs}
                className="mr-2 rounded-lg bg-blue-500 px-4 py-2 text-slate-200 transition duration-200 hover:brightness-110 active:brightness-90"
              >
                Refresh Log
              </button>
            </div>
            <div className="inline-block rounded-lg bg-slate-200 px-2">
              <button
                onClick={() => setShowPodLog(false)}
                className="rounded-lg bg-red-500 px-4 py-2 text-slate-200 transition duration-200 hover:brightness-110 active:brightness-90"
              >
                Close Log
              </button>
            </div>
          </div>
          <pre className="whitespace-pre-wrap text-xs text-slate-900">
            {podLog}
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
