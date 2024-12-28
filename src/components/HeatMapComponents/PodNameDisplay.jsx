/**
 * This component renders Namespace, Pod Name and Deployment data
 */

import PropTypes from "prop-types";
import { useEffect } from "react";
import "../../Overview.css";

const PodNameDisplay = ({ clickedPod, setClickedPod }) => {
  const { podName, namespace, deploymentName } = clickedPod;

  // move setClickedPod iside an useEffect to avoid calling setClickedPod directly during render (warning in console).
  useEffect(() => {
    if (deploymentName === "deployment not found") {
      setClickedPod((prev) => ({
        ...prev,
        deploymentName: "-",
      }));
    }
  }, [deploymentName, setClickedPod]);

  return (
    <div className="w-full bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 text-center text-[#e2e8f0] transition-all">
      <div
        id="overview-info"
        className="mx-60 flex flex-1 items-center justify-between gap-28 transition-all duration-300"
      >
        <div
          id="namespace"
          className="flex-shrink flex-grow basis-1/4 rounded-xl border-4 p-4 transition-all duration-500"
        >
          <h2 className="text-2xl font-extrabold">Namespace</h2>
          <br />
          <p className="text-4xl font-semibold">{podName ? namespace : "-"}</p>
        </div>
        <div
          id="pod-name"
          className="flex-shrink flex-grow basis-1/4 rounded-xl border-4 p-4 transition-all duration-500"
        >
          <h2 className="text-2xl font-extrabold">
            {podName ? "Selected Pod" : "No Pod Selected"}
          </h2>
          <br />
          <p className="text-4xl font-semibold">
            {podName ? podName : "Displaying Node Average Metrics"}
          </p>
        </div>
        <div
          id="deployment"
          className="flex-shrink flex-grow basis-1/4 rounded-xl border-4 p-4 transition-all duration-500"
        >
          <h2 className="text-2xl font-extrabold">Deployment</h2>
          <br />
          <p className="text-4xl font-semibold">
            {podName ? deploymentName : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

PodNameDisplay.propTypes = {
  clickedPod: PropTypes.object.isRequired,
  setClickedPod: PropTypes.func,
};

export default PodNameDisplay;
