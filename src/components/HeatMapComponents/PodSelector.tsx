/**
 * This component renders the 'Select a Pod' dropdown
 */

import { useEffect } from "react";

import mainStore from "../../stores/mainStore";
import { podObj } from "../../hooks/usePodListProcessor";
import podStore from "../../stores/podStore";

const PodSelector = (props: { podList: podObj[]; }) => {
  const { podList } = props;
  const { defaultView, setDefaultView, clickedPod, setClickedPod } = mainStore();
  const { selectedValue, setSelectedValue } = podStore();

  // Update selectedValue when user clicks on a pod in the heatmap
  useEffect(() => {
    if (clickedPod.podName && clickedPod.namespace) {
      setSelectedValue(`${clickedPod.namespace}||${clickedPod.podName}`);
    }
  }, [clickedPod, setSelectedValue]);

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
  }, [defaultView, setClickedPod, setSelectedValue]);

  // Group pods by namespace
  const podsByNamespace = podList.reduce<Record<string, podObj[]>>((acc, pod) => {
    if (!acc[pod.namespace]) {
      acc[pod.namespace] = [];
    }
    acc[pod.namespace].push(pod);
    return acc;
  }, {});

  return (
    <div id="pod-selector" className="col-span-3">
      <select
        id="pod-selector-dropdown"
        value={selectedValue} // This controls what's displayed in the closed select
        className="w-full rounded-lg border-2 border-transparent bg-slate-200 px-3 py-2 text-center text-sm font-semibold text-slate-500 transition duration-200 hover:brightness-90 dark:text-slate-300 dark:bg-slate-800"
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

export default PodSelector;
