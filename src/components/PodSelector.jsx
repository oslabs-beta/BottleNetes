import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const PodSelector = ({
  podList,
  setClickedPod,
  defaultView,
  setDefaultView,
}) => {
  const [selectedValue, setSelectedValue] = useState("");

  // Reset when defaultView becomes true
  useEffect(() => {
    // If default view is true, reset the selected value and clicked pod
    if (defaultView) {
      setSelectedValue("");
      setClickedPod({
        podName: "-",
        namespace: "-",
        containers: [],
        deployment: "-",
      });
    }
  }, [defaultView, setClickedPod]);

  // Group pods by namespace
  const podsByNamespace = podList.reduce((acc, pod) => {
    if (!acc[pod.namespace]) {
      acc[pod.namespace] = [];
    }
    acc[pod.namespace].push(pod);
    return acc;
  }, {});

  return (
    <div id="pod-selector" className="relative">
      <select
        id="pod-selector-dropdown"
        value={selectedValue} // This controls what's displayed in the closed select
        onChange={(e) => {
          const value = e.target.value;
          setSelectedValue(value); // Update what's shown in the closed select

          if (value) {
            const [namespace, podName] = value.split("||");
            const selectedPod = podList.find(
              (pod) => pod.namespace === namespace && pod.podName === podName,
            );
            if (selectedPod) {
              setClickedPod({
                podName: selectedPod.podName,
                namespace: selectedPod.namespace,
                containers: selectedPod.containers,
              });
              // If a pod is selected, set default view to false
              setDefaultView(false);
            }
          }
        }}
        className="rounded-lg bg-gradient-to-r from-slate-200 to-slate-100 px-3 py-2 text-sm font-medium text-slate-500"
      >
        <option value="">Select a Pod</option>
        {Object.entries(podsByNamespace).map(([namespace, pods]) => (
          // iterate over each namespace and its pods, creating an optgroup for each namespace
          <optgroup key={namespace} label={`Namespace: ${namespace}`}>
            {pods.map((pod) => (
              // create an option for each pod in the namespace, using namespace and pod name as the value
              <option
                // use namespace and pod name as the value, separated by "||", to avoid conflicts
                key={`${pod.namespace}||${pod.podName}`}
                value={`${pod.namespace}||${pod.podName}`}
              >
                {pod.podName}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
};

PodSelector.propTypes = {
  podList: PropTypes.arrayOf(PropTypes.object).isRequired,
  setClickedPod: PropTypes.func.isRequired,
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
};

export default PodSelector;