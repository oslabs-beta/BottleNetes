/**
 * This component renders 'Restart Pod' button with its Popups
 */

import PropTypes from "prop-types";
import { useState } from "react";

const PodRestart = ({
  clickedPod,
  setClickedPod,
  podRestartCount,
  setPodRestartCount,
  setDefaultView,
  backendUrl,
}) => {
  const [showRestartPopup, setShowRestartPopup] = useState(false);
  const [restartStatus, setRestartStatus] = useState("confirm"); // other state: 'loading', 'error', 'success'

  // console.log("clicked pod containers: ", clickedPod.containers);
  const handleRestartPod = () => {
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }
    setShowRestartPopup(true);
  };

  const proceedRestartPod = async () => {
    console.log(`Sending request to '${backendUrl}k8s/restartPod'...`);

    try {
      setRestartStatus("loading");
      const response = await fetch(backendUrl + "k8s/restartPod", {
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
      // if the pod is successfully restarted
      if (data.status === "success") {
        setPodRestartCount(podRestartCount + 1);
        setRestartStatus("success");
      } else {
        // if the pod restart failed
        setRestartStatus("error");
      }
    } catch (error) {
      console.error("Error restarting pod:", error);
      setRestartStatus("error");
    }
  };

  const renderRestartPopupContent = () => {
    switch (restartStatus) {
      case "success":
        return (
          <div id="pod-restart-success" className="text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#458045"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fontSize="6vh"
              className="inline"
              id="success"
            >
              <path d="M21.801 10A10 10 0 1 1 17 3.335" />
              <path d="m9 11 3 3L22 4" />
            </svg>
            <p className="p-4">Sucessfully restarted Pod</p>
            <p>
              <strong>{clickedPod.podName}</strong>
            </p>
            <br />
            <p>
              It will take a few moments for this pod to become active again.
            </p>
            <br />
            <button
              onClick={() => {
                setShowRestartPopup(false);
                setClickedPod({ podName: "", namespace: "", containers: [] });
                setDefaultView(true);
                setRestartStatus("confirm");
              }}
              className="rounded-lg bg-slate-600 px-4 py-2 text-slate-100 transition duration-200 hover:brightness-110 active:brightness-90"
            >
              Confirm
            </button>
          </div>
        );
      case "loading":
        return (
          <div id="pod-restart-loading" className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-500"></div>
            <p>
              Restarting pod <strong>{clickedPod.podName}</strong>...
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
                className="rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:brightness-110 active:brightness-90"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  setShowRestartPopup(false);
                  setRestartStatus("confirm");
                }}
                className="rounded-lg bg-slate-600 px-4 py-2 text-slate-100 transition duration-200 hover:brightness-110 active:brightness-90"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      // default state is 'confirm'
      default:
        return (
          <div id="pod-restart-confirm" className="text-center">
            <p>
              You will be restarting pod <strong>{clickedPod.podName}</strong>{" "}
              in namespace <strong>{clickedPod.namespace}</strong>.
            </p>
            <br />
            <p>
              This pod will be deleted, after that, another replica of this pod
              will be automatically created.
            </p>
            <br />
            <p>The process may take a few seconds to one minute.</p>
            <br />
            <p>Are you sure you want to proceed?</p>
            <div
              id="pod-restart-confirm-button"
              className="mt-4 flex justify-between"
            >
              <button
                onClick={proceedRestartPod}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition duration-200 hover:brightness-110 active:brightness-90"
              >
                Proceed
              </button>
              <button
                onClick={() => {
                  setShowRestartPopup(false);
                  setRestartStatus("confirm");
                }}
                className="rounded-lg bg-slate-600 px-4 py-2 text-slate-100 transition duration-200 hover:brightness-110 active:brightness-90"
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
        className="w-full rounded-lg border-2 border-transparent bg-slate-200 px-3 py-2 text-sm font-medium text-slate-500 font-semibold transition duration-200 hover:brightness-90 active:brightness-105 dark:text-slate-300 dark:bg-slate-800"
      >
        Restart Pod
      </button>
      <div
        id="pod-restart-popup"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition duration-150 ${showRestartPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div className="w-1/5 rounded-lg bg-slate-200 p-4 text-slate-800">
          {renderRestartPopupContent()}
        </div>
      </div>
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
  podRestartCount: PropTypes.number.isRequired,
  setPodRestartCount: PropTypes.func.isRequired,
  setDefaultView: PropTypes.func,
  backendUrl: PropTypes.string.isRequired,
};

export default PodRestart;
