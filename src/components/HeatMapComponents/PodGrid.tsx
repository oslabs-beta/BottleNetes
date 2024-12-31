/**
 * This component renders the heatmap with the following components:
 * Pod.jsx: Renders pods in heatmap
 * PodGridMetricSelection.jsx: Renders buttons to select metrics to render in heatmap
 * PodLogDisplay.jsx: Render 'View Pod Log' button
 * PodRestart.jsx: Render 'Restart Pod' button
 * QueryTimeWindowConfiguration.jsx: Render 'Time Window' button
 * PodSelector.jsx: Render 'Select a Pod...' dropdown and show the list of current pods
 * PodSorter.jsx: Render 'Sort by...' dropdown
 * PodFilter.jsx: Render 'Filter by...' dropdown
 * usePodListProcessor.jsx: A hook to extract and memoize data for pods
 */

import React from "react";
import { useState } from "react";

// Components from 'HeatMapComponents' folder
import Pod from "./Pod.jsx";
import PodAdjustRequestsLimits from "./PodAdjustRequestsLimits.jsx";
import PodGridMetricSelection from "./PodGridMetricSelection.jsx";
import PodLogDisplay from "./PodLogDisplay.jsx";
import PodReplicas from "./PodReplicas.jsx";
import PodRestart from "./PodRestart.jsx";
import QueryTimeWindowConfiguration from "./QueryTimeWindowConfiguration.jsx";
import PodSelector from "./PodSelector.jsx";
import PodSorter from "./PodSorter.jsx";
import PodFilter from "./PodFilter.jsx";
import usePodListProcessor from "../../hooks/usePodListProcessor.ts";

// Component from 'containers' folder
import LoadingContainer from "../../containers/LoadingContainer.tsx";

import dataStore from "../../stores/dataStore.ts";
import mainStore from "../../stores/mainStore.ts";

const PodGrid = () => {
  // States from mainStore.tsx
  const {
    defaultView,
    setDefaultView,
    queryTimeWindow,
    setQueryTimeWindow,
    clickedPod,
    setClickedPod,
    selectedMetric,
    setSelectedMetric,
  } = mainStore();
  
  // Data from useFetchData hook and state from dataStore.tsx
  const podStatuses = dataStore((state) => state.allData.podsStatuses);
  const cpuUsageOneValue = dataStore((state) => state.allData.cpuUsageOneValue);
  const memoryUsageOneValue = dataStore(
    (state) => state.allData.memoryUsageOneValue
  );
  const requestLimits = dataStore((state) => state.allData.requestLimits);
  const latencyAppRequestOneValue = dataStore(
    (state) => state.allData.latencyAppRequestOneValue
  );  
  const backendUrl = dataStore((state) => state.backendUrl);

  /**
   * State to render sorted Pods by selected metric
   * Available metrics: CPU Usage (%), Memory Usage (%), Latency
   **/
  const [metricToSort, setMetricToSort] = useState("");
  /**
   * State to render filtered Pod by selected type
   * Available types: Namespace, Service, Deployment
   **/
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

  // If Pod Statuses are still being fetched, return the Loading Screen
  if (!Array.isArray(podStatuses) && !podStatuses.allPodsStatus) {
    return <LoadingContainer />;
  }

  // Extract data from processedPodList for each Pod
  const buttonArray = processedPodList.map((podObj, index) => (
    <Pod
      podInfo={podObj}
      key={index}
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
          deployment: podObj.deployment,
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
      {/* Configuring buttons on top of the heat map */}
      <div
        id="control-buttons-row"
        className="grid grid-cols-4 gap-x-4 gap-y-2 px-4 py-2"
      >
        <PodRestart />
        <PodLogDisplay />
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

      {/* Bottom Container: Contains buttons to render graphs based on select metric and the heat map*/}
      <div className="flex flex-1">
        {/* Left Column - Selection Buttons */}
        <div className="flex w-1/4 min-w-[207px] flex-col justify-start gap-2 p-4">
          <QueryTimeWindowConfiguration
            queryTimeWindow={queryTimeWindow}
            setQueryTimeWindow={setQueryTimeWindow}
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
            className="rounded-2xl border-4 border-blue-600 bg-gradient-to-r from-slate-200 to-slate-100 px-2 py-4 text-lg font-semibold text-blue-600 transition duration-200 hover:border-2 hover:bg-gradient-to-r hover:from-[#1d4ed8] hover:to-[#2563eb] hover:text-slate-100"
          >
            Reset
          </button>
        </div>

        {/* Right Column - Pod Heat Map */}
        <div
          id="pod-heat-map"
          className="z-10 my-4 mr-3 w-3/4 overflow-visible rounded-xl border-2 border-blue-500/10 bg-blue-500/10 p-2"
        >
          <div id="pod-grid" className={gridStyle}>
            {buttonArray}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PodGrid;
