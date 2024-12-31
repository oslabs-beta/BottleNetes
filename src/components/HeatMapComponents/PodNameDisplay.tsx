/**
 * This component renders Namespace, Pod Name and Deployment data
 */
import "../../Overview.css";

import mainStore from "../../stores/mainStore";

const PodNameDisplay = () => {
  const { clickedPod } = mainStore();

  const { podName, namespace, deploymentName } = clickedPod;

  return (
    <div className="bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 text-center text-[#e2e8f0] dark:bg-gradient-to-r dark:from-slate-950 dark:to-slate-900">
      <div
        id="overview-info"
        className="mx-10 grid grid-cols-4 items-center justify-between gap-5 transition duration-300"
      >
        <div
          id="namespace"
          className="rounded-xl border-2 p-4 transition duration-500 h-full dark:border-slate-300"
        >
          <h2 className="text-xl font-extrabold dark:text-slate-300">Namespace</h2>
          <br />
          <p className="text-2xl font-semibold dark:text-slate-300">{podName ? namespace : "-"}</p>
        </div>
        <div
          id="pod-name"
          className="rounded-xl border-2 p-4 transition duration-500 col-span-2 h-full dark:border-slate-300"
        >
          <h2 className="text-xl font-semibold dark:text-slate-300">
            {podName ? "Selected Pod" : "No Pod Selected"}
          </h2>
          <br />
          <p className="text-2xl font-semibold dark:text-slate-300">
            {podName ? podName : "Displaying Node Average Metrics"}
          </p>
        </div>
        <div
          id="deployment"
          className="rounded-xl border-2 p-4 transition duration-500 h-full dark:border-slate-300"
        >
          <h2 className="text-xl font-extrabold dark:text-slate-300">Deployment</h2>
          <br />
          <p className="text-2xl font-semibold dark:text-slate-300">
            {podName ? deploymentName : "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PodNameDisplay;
