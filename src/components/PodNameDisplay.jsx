// PodNameDisplay.jsx
import PropTypes from "prop-types";
import "../Overview.css";
import { useEffect } from "react";

const PodNameDisplay = ({ clickedPod, setClickedPod }) => {
  const { podName, namespace, deployment } = clickedPod;

  useEffect(() => {
    const getDeployment = async () => {
      console.log("Sending POST request to '/k8s/deployment' endpoint...");

      if (!podName || !namespace) return;
      try {
        const response = await fetch("http://localhost:3000/k8s/deployment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            podName,
            namespace,
          }),
        });

        const data = await response.json();
        console.log(data.data);

        if (data.status !== "success") {
          console.log(`Deployment not found: ${data}`);
        }

        if (!data.data.deployment) {
          setClickedPod((prev) => ({
            ...prev,
            deployment: "-",
          }));
        }

        setClickedPod((prev) => ({
          ...prev,
          deployment: data.data.deployment,
        }));
      } catch (error) {
        console.error(`Unable to send request: ${error}`);

        setClickedPod((prev) => ({
          ...prev,
          deployment: "-",
        }));
      }
    };

    getDeployment();
  }, [namespace, podName, setClickedPod]);

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
          <p className="text-4xl font-semibold">{podName ? deployment : "-"}</p>
        </div>
      </div>
    </div>
  );
};

PodNameDisplay.propTypes = {
  clickedPod: PropTypes.object,
  setClickedPod: PropTypes.func,
};

export default PodNameDisplay;
