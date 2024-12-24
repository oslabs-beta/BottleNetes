import PropTypes from "prop-types";
import { useState } from "react";

const PodLogDisplay = ({ clickedPod, backendUrl }) => {
  const [showPodLog, setShowPodLog] = useState(false);
  const [podLog, setPodLog] = useState("No logs available");

  const handleViewPodLog = async () => {
    if (
      !clickedPod.podName ||
      !clickedPod.namespace ||
      !clickedPod.containers
    ) {
      alert("Please select a pod first");
      return;
    }

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
        }),
      });
      const podLogs = await response.json();
      setPodLog(podLogs.logs);
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
        className="border-1 rounded-lg border-slate-200 bg-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
      >
        View Pod Log
      </button>

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
          className="relative h-[80vh] w-[80vw] overflow-auto rounded-lg bg-slate-200 p-6"
        >
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
