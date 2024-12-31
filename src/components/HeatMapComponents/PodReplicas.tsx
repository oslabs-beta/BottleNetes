/**
 * This component renders the 'Modify Replicas' button and its popup and functionalities
 */

import React from "react";

import mainStore from "../../stores/mainStore.ts";
import dataStore from "../../stores/dataStore.ts";
import podStore from "../../stores/podStore.ts";

const PodReplicas = () => {
  const clickedPod = mainStore((state) => state.clickedPod);
  const backendUrl = dataStore((state) => state.backendUrl);
  const {showReplicasPopup, setShowReplicasPopup, newReplicas, setNewReplicas} = podStore();

  const handleReplicas = async () => {
    if (!clickedPod.podName || !clickedPod.namespace) {
      alert("Please select a pod first");
      return;
    }
    setShowReplicasPopup(true);
  };

  const proceedReplicas = async () => {
    console.log(`Sending request to '${backendUrl}k8s/replicas'...`);

    try {
      const response = await fetch(backendUrl + "k8s/replicas", {
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
      if (error instanceof Error) {
        alert(`Failed to send request: ${error.message}`);
      } else {
        alert("Failed to send request: An unknown error occurred.");
      }
    } finally {
      setShowReplicasPopup(false);
    }
  };

  const cancelReplicas = () => {
    setShowReplicasPopup(false);
  };

  return (
    <div id="pod-replica-component">
      <button
        className="w-full rounded-lg border-2 border-slate-200 bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500 transition duration-200 hover:brightness-90"
        onClick={handleReplicas}
      >
        Modify Replicas
      </button>

      {/* Replicas Popup */}
      <div
        id="replicas-display"
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition duration-300 ${showReplicasPopup ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <div
          id="replicas-popup"
          className="w-1/4 rounded-lg bg-slate-200 p-6 text-center text-slate-800"
        >
          <h2>Enter the amount of replicas for the designated Deployment</h2>
          <br />
          <div
            id="replicas-popup-info-display"
            className="border rounded-xl border-slate-300 bg-slate-300 p-4 text-left"
          >
            <p>
              Selected Pod: <strong>{clickedPod.podName}</strong>
            </p>
            <p>
              Namespace: <strong>{clickedPod.namespace}</strong>
            </p>
            <p>
              Deployment: <strong>{clickedPod.deploymentName}</strong>
            </p>
          </div>
          <input
            value={newReplicas}
            type="number"
            onChange={(e) => setNewReplicas(Number(e.target.value))}
            className="my-6 w-full rounded-lg bg-slate-300 p-2 text-slate-800 focus:brightness-90 hover:brightness-110 transition duration-300"
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
    </div>
  );
};

export default PodReplicas;
