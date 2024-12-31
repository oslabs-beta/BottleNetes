/**
 * This component renders Namespace, Pod Name and Deployment data
 */
import React from "react";
import { useEffect } from "react";
import "../../Overview.css";

import mainStore from "../../stores/mainStore.ts";

const PodNameDisplay = () => {
  const { clickedPod, setClickedPod } = mainStore();

  const { podName, namespace, deployment } = clickedPod;

  // move setClickedPod inside an useEffect to avoid calling setClickedPod directly during render (warning in console).
  useEffect(() => {
    if (deployment === "deployment not found") {
      setClickedPod({ ...clickedPod, deployment: "undefined" });
    }
  }, [deployment, setClickedPod]);

  return (
    <div className="bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 text-center text-[#e2e8f0]">
      <div
        id="overview-info"
        className="mx-10 grid grid-cols-4 items-center justify-between gap-5 transition duration-300"
      >
        <div
          id="namespace"
          className="h-full rounded-xl border-4 p-4 transition duration-500"
        >
          <h2 className="text-2xl font-extrabold">Namespace</h2>
          <br />
          <p className="text-3xl font-semibold">{podName ? namespace : "-"}</p>
        </div>
        <div
          id="pod-name"
          className="col-span-2 h-full rounded-xl border-4 p-4 transition duration-500"
        >
          <h2 className="text-2xl font-extrabold">
            {podName ? "Selected Pod" : "No Pod Selected"}
          </h2>
          <br />
          <p className="text-3xl font-semibold">
            {podName ? podName : "Displaying Node Average Metrics"}
          </p>
        </div>
        <div
          id="deployment"
          className="h-full rounded-xl border-4 p-4 transition duration-500"
        >
          <h2 className="text-2xl font-extrabold">Deployment</h2>
          <br />
          <p className="text-3xl font-semibold">
            {podName ? deployment : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PodNameDisplay;
