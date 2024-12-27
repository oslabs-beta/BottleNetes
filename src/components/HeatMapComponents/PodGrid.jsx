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
  latencyAppRequestOneValue,
  queryTimeWindow,
  setQueryTimeWindow,
  backendUrl,
}) => {
  const [metricToSort, setMetricToSort] = useState("");
  const [filterConfig, setFilterConfig] = useState({
    type: "",
    value: "",
    operator: "over",
  });

  if (!podStatuses.allPodsStatus) {
    return <div>loading...</div>;
  }

  const podList = podStatuses?.allPodsStatus?.map((pod) => {
    const podObj = {
      podName: pod.podName,
      namespace: pod.namespace,
      status: pod.status,
      readiness: pod.readiness,
      containers: pod.containers,
      service: pod.service,
      deploymentName: pod.deploymentName,
      selectedMetric,
    };

    const cpuData = cpuUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.cpuDataRelative = cpuData?.usageRelativeToRequest;
    podObj.cpuDataAbsolute = cpuData?.usageAbsolute;

    const memoryData = memoryUsageOneValue?.resourceUsageOneValue?.find(
      (obj) => obj.name === pod.podName,
    );
    podObj.memoryDataRelative = memoryData?.usageRelativeToRequest;
    podObj.memoryDataAbsolute = memoryData?.usageAbsolute;

    const latencyData =
      latencyAppRequestOneValue?.latencyAppRequestOneValue?.find(
        (obj) => obj.name === pod.podName,
      );
    podObj.latencyData = latencyData?.avgCombinedLatency;

    return podObj;
  });

  let processedPodList = [...podList];

  // Apply filter
  if (filterConfig.type && filterConfig.value && !defaultView) {
    processedPodList = processedPodList.filter((pod) => {
      if (["cpuRelative", "memoryRelative"].includes(filterConfig.type)) {
        const value = pod[filterConfig.type];
        const threshold = parseFloat(filterConfig.value);
        return filterConfig.operator === "over"
          ? value > threshold
          : value < threshold;
      }
      return pod[filterConfig.type] === filterConfig.value;
    });
  }

  // Only sort if a metricToSort is selected and default view is false
  if (metricToSort && !defaultView) {
    processedPodList.sort(
      // when metric data is not available, default to 0
      (a, b) => (b[metricToSort] || 0) - (a[metricToSort] || 0),
    );
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
        // && clickedPod.deploymentName === podObj.deploymentName // don't need to check deployment for isClicked, will mess up with selector
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
    "grid gap-[2px] mr-2 mt-1 grid-cols-5 overflow-visible md:grid-cols-7 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7 3xl:grid-cols-9 relative z-20";

  return (
    <div className="flex h-full flex-col overflow-visible">
      {/* Configuring buttons */}
      <div id="control-buttons-row" className="mb-4 flex flex-wrap gap-2 p-4">
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
          podList={podList}
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
          podList={podList}
          setFilterConfig={setFilterConfig}
          defaultView={defaultView}
          setDefaultView={setDefaultView}
        />
      </div>

      {/* Bottom Container */}
      <div className="flex flex-1">
        {/* Left Column - Selection Buttons */}
        <div className="flex w-1/4 min-w-[207px] max-w-[250px] flex-col justify-start gap-4 p-4">
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
              // Reset filter configuration
              setFilterConfig({
                type: "",
                value: "",
                operator: "over",
              });
              // Reset sort configuration
              setMetricToSort("");
            }}
            className="rounded-2xl border-4 border-blue-600 bg-gradient-to-r from-slate-200 to-slate-100 px-2 py-4 text-lg font-semibold text-blue-600 transition duration-200 hover:border-2 hover:bg-gradient-to-r hover:from-[#1d4ed8] hover:to-[#2563eb] hover:text-slate-100"
          >
            Reset
          </button>
        </div>

        {/* Right Column - Pod Heat Map */}
        <div
          id="pod-heat-map"
          className="relative z-10 w-3/4 overflow-visible p-4"
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
