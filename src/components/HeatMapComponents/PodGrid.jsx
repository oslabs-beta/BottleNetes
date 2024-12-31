/**
 * This component renders the heatmap with the following components:
 * Pod.jsx: Renders pods in heatmap
 * PodGridMetricSelection.jsx: Renders buttons to select metrics to render in heatmap
 * PodLogDisplay.jsx: Render 'View Pod Log' button
 * PodRestart.jsx: Render 'Restart Pod' button
 * QueryTimeWindowConfiguration.jsx: Render 'Time Window' button
 */

import PropTypes from "prop-types";
import { useState } from "react";

import Pod from "./Pod";
import PodAdjustRequestsLimits from "./PodAdjustRequestsLimits";
import PodGridMetricSelection from "./PodGridMetricSelection";
import PodLogDisplay from "./PodLogDisplay";
import PodReplicas from "./PodReplicas";
import PodRestart from "./PodRestart";
import QueryTimeWindowConfiguration from "./QueryTimeWindowConfiguration";
import PodSelector from "./PodSelector";
import PodSorter from "./PodSorter";
import PodFilter from "./PodFilter";
import usePodListProcessor from "../../hooks/usePodListProcessor";

const PodGrid = ({
  defaultView,
  setDefaultView,
  clickedPod,
  setClickedPod,
  selectedMetric,
  setSelectedMetric,
  podRestartCount,
  setPodRestartCount,
  podStatuses,
  cpuUsageOneValue,
  memoryUsageOneValue,
  requestLimits,
  latencyAppRequestOneValue,
  queryTimeWindow,
  setQueryTimeWindow,
  backendUrl,
}) => {
  const [metricToSort, setMetricToSort] = useState("");
  const [filterConfig, setFilterConfig] = useState({
    type: "",
    value: "",
  });

  // Funan: separated the preparation of the pod list into a custom hook, usePodListProcessor
  const processedPodList = usePodListProcessor({
    podStatuses,
    cpuUsageOneValue,
    memoryUsageOneValue,
    latencyAppRequestOneValue,
    requestLimits,
    selectedMetric,
    filterConfig,
    metricToSort,
    defaultView,
  });

  if (!podStatuses.allPodsStatus) {
    return <div>loading...</div>;
  }

  const buttonArray = processedPodList.map((podObj) => (
    <Pod
      podInfo={podObj}
      key={podObj.podName}
      type="button"
      selectedMetric={selectedMetric}
      isClicked={
        clickedPod.podName === podObj.podName &&
        clickedPod.namespace === podObj.namespace &&
        clickedPod.containers === podObj.containers
      }
      onClick={() => {
        setClickedPod({
          podName: podObj.podName,
          namespace: podObj.namespace,
          containers: podObj.containers,
          deploymentName: podObj.deploymentName,
        });
        setDefaultView(false);
      }}
    />
  ));

  // Dynamic Grid Style for the heatmap
  const gridStyle =
    "grid gap-[2px] grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";

  return (
    <div className="flex h-full flex-col overflow-visible">
      {/* Configuring buttons */}
      <div
        id="control-buttons-row"
        className="grid grid-cols-4 gap-x-4 gap-y-2 px-4 py-2"
      >
        <PodRestart
          clickedPod={clickedPod}
          setClickedPod={setClickedPod}
          podRestartCount={podRestartCount}
          setPodRestartCount={setPodRestartCount}
          setDefaultView={setDefaultView}
          backendUrl={backendUrl}
        />
        <PodLogDisplay clickedPod={clickedPod} backendUrl={backendUrl} />
        <PodReplicas clickedPod={clickedPod} backendUrl={backendUrl} />
        <PodAdjustRequestsLimits
          clickedPod={clickedPod}
          backendUrl={backendUrl}
        />
        <PodSelector
          podList={processedPodList}
          setClickedPod={setClickedPod}
          defaultView={defaultView}
          setDefaultView={setDefaultView}
          clickedPod={clickedPod}
        />
        <PodSorter
          setMetricToSort={setMetricToSort}
          defaultView={defaultView}
          setDefaultView={setDefaultView}
        />
        <PodFilter
          podList={processedPodList}
          setFilterConfig={setFilterConfig}
          defaultView={defaultView}
          setDefaultView={setDefaultView}
        />
      </div>

      {/* Bottom Container */}
      <div className="flex flex-1">
        {/* Left Column - Selection Buttons */}
        <div className="flex w-1/4 min-w-[207px] flex-col justify-start gap-2 p-4 mr-4">
          <QueryTimeWindowConfiguration
            queryTimeWindow={queryTimeWindow}
            setQueryTimeWindow={setQueryTimeWindow}
            id="query-time-window-configuration"
          />
          <PodGridMetricSelection
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
          />
          {/* Left Side Buttons */}
          <button
            id="reset-button"
            onClick={() => {
              setDefaultView(true);
              setClickedPod({
                podName: "-",
                namespace: "-",
                containers: [],
                deployment: "-",
              });
              setSelectedMetric("cpu");
              setQueryTimeWindow("1m");
              setFilterConfig({
                type: "",
                value: "",
              });
              setMetricToSort("");
            }}
            className="rounded-2xl border-4 border-blue-600 bg-slate-100 px-4 py-2 py-5 text-lg font-semibold text-blue-600 transition transition-colors duration-200 hover:brightness-90 dark:bg-transparent dark:border-2 dark:border-slate-300 dark:text-slate-300"
          >
            Reset
          </button>
        </div>

        {/* Right Column - Pod Heat Map */}
        <div
          id="pod-heat-map"
          className="z-10 my-4 mr-3 w-3/4 overflow-visible rounded-xl border-4 border-blue-500 dark:border-2 dark:border-slate-300 bg-transparent p-4"
        >
          <div id="pod-grid" className={gridStyle}>
            {buttonArray}
          </div>
        </div>
      </div>
    </div>
  );
};

PodGrid.propTypes = {
  defaultView: PropTypes.bool.isRequired,
  setDefaultView: PropTypes.func.isRequired,
  clickedPod: PropTypes.shape({
    podName: PropTypes.string,
    namespace: PropTypes.string,
    containers: PropTypes.array,
    deploymentName: PropTypes.string,
  }).isRequired,
  setClickedPod: PropTypes.func.isRequired,
  selectedMetric: PropTypes.string.isRequired,
  setSelectedMetric: PropTypes.func.isRequired,
  podRestartCount: PropTypes.number.isRequired,
  setPodRestartCount: PropTypes.func.isRequired,
  podStatuses: PropTypes.shape({
    allPodsStatus: PropTypes.array,
  }),
  requestLimits: PropTypes.object,
  cpuUsageOneValue: PropTypes.object,
  memoryUsageOneValue: PropTypes.object,
  latencyAppRequestOneValue: PropTypes.object,
  queryTimeWindow: PropTypes.string.isRequired,
  setQueryTimeWindow: PropTypes.func.isRequired,
  backendUrl: PropTypes.string.isRequired,
};

export default PodGrid;
