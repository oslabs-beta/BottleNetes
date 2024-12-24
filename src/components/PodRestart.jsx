import PropTypes from "prop-types";
import { useState } from "react";

const PodRestart = ({
  clickedPod,
  setClickedPod,
  setPodRestartCount,
  backendUrl,
}) => {
  const [showRestartPopup, setShowRestartPopup] = useState(false);
  const [restartStatus, setRestartStatus] = useState("confirm"); // other state: 'loading', 'error'

  const handleRestartPod = () => {
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }
    setShowRestartPopup(true);
  };

  const proceedRestartPod = async () => {
    try {
      setRestartStatus("loading");
      const response = await fetch(backendUrl + "/k8s/restartPod", {
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
        setPodRestartCount((prev) => prev + 1);
        setClickedPod({ podName: "", namespace: "", containers: [] });
        setShowRestartPopup(false);
      } else {
        setRestartStatus("error");
      }
    } catch (error) {
      console.error("Error restarting pod:", error);
      setRestartStatus("error");
    }
  };

  const renderRestartPopupContent = () => {
    switch (restartStatus) {
      case "loading":
        return (
          <div id="pod-restart-loading" className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p>
              Deleting pod <strong>{clickedPod.podName}</strong>...
            </p>
          </div>
        );
      case "error":
        return (
          <div id="pod-restart-error" className="text-center">
            <p className="mb-4 text-red-500">
              Failed to restart pod <strong>{clickedPod.podName}</strong>
            </p>
            <p className="mb-4">Would you like to try again?</p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setRestartStatus("confirm")}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setShowRestartPopup(false);
                  setRestartStatus("confirm");
                }}
                className="rounded-lg bg-slate-600 px-4 py-2 text-slate-100 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        );
      default: // default state is 'confirm'
        return (
          <div id="pod-restart-confirm">
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
            <div
              id="pod-restart-confirm-button"
              className="mt-4 flex justify-center space-x-2"
            >
              <button
                onClick={proceedRestartPod}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                Proceed
              </button>
              <button
                onClick={() => {
                  setShowRestartPopup(false);
                  setRestartStatus("confirm");
                }}
                className="rounded-lg bg-slate-600 px-4 py-2 text-slate-100 hover:bg-slate-700"
              >
                Cancel
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="pod-restart">
      <button
        onClick={handleRestartPod}
        className="border-1 rounded-lg border-slate-200 bg-gradient-to-r from-slate-300 to-slate-200 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
      >
        Restart Pod
      </button>

      {showRestartPopup && (
        <div
          id="pod-restart-popup"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition duration-300"
        >
          <div className="w-80 rounded-lg bg-slate-200 p-6 text-slate-800">
            {renderRestartPopupContent()}
          </div>
        </div>
      )}
    </div>
  );
};

PodRestart.propTypes = {
  clickedPod: PropTypes.shape({
    podName: PropTypes.string,
    namespace: PropTypes.string,
    containers: PropTypes.array,
  }).isRequired,
  setClickedPod: PropTypes.func.isRequired,
  setPodRestartCount: PropTypes.func.isRequired,
  backendUrl: PropTypes.string.isRequired,
};

export default PodRestart;
