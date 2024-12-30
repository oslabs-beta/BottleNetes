/**
 * This component renders the main page with the following components:
 * - MenuContainer.jsx: Display the menu section
 * - Latency.jsx: Display the Latency chart
 * - Metrics.jsx: Display historical data for resource usages
 * - Overview.jsx: Display the overview
 * - RequestLimit.jsx: Display the Request vs. Limit chart
 * - PodGrid.jsx: Display the heatmap
 * - PodNameDisplay.jsx: Display the Namespace, Pod Name and Deployment
 */

import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

// Hooks Folder
import useFetchData from "../hooks/useFetchData";

// Container Folder
import MenuContainer from "./MenuContainer";

// Component Folder
import Overview from "../components/Overview";
import Latency from "../components/LatencyComponents/Latency";
import Metrics from "../components/HistoricalMetricsComponents/Metrics";
import RequestLimit from "../components/RequestLimitComponents/RequestLimit";
import DarkMode from "../components/DarkMode";

// Component/HeatMapComponent Folder
import PodGrid from "../components/HeatMapComponents/PodGrid";
import PodNameDisplay from "../components/HeatMapComponents/PodNameDisplay";

const MainContainer = ({ username, backendUrl }) => {
  // Determines if the graphs display node data or pod specific data
  const [defaultView, setDefaultView] = useState(true);

  // State hook for time window in PodGrid
  const [queryTimeWindow, setQueryTimeWindow] = useState("1m");

  // state hooks for clicked pod and selected metric in PodGrid (will also be passed down to other components)
  const [clickedPod, setClickedPod] = useState({
    podName: "",
    namespace: "",
    containers: [],
    deployment: "",
  });
  const [selectedMetric, setSelectedMetric] = useState("cpu");

  // State hook for pod restarts in PodGrid
  const [podRestartCount, setPodRestartCount] = useState(0);

  // State hooks for refresh control in MenuContainer
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [refreshFrequency, setRefreshFrequency] = useState(30 * 1000);
  const [showRefreshPopup, setShowRefreshPopup] = useState(false);
  const [refreshInput, setRefreshInput] = useState("");

  // State hook for set the menu sidebar's visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { allData } = useFetchData({
    backendUrl,
    refreshFrequency,
    queryTimeWindow,
    podRestartCount,
    manualRefreshCount,
  });

  // ensure the clickedPod state stays valid after each refresh
  useEffect(() => {
    if (allData.podsStatuses?.allPodsStatus?.length > 0 && clickedPod.podName) {
      // Check if the clicked pod still exists in the updated data
      const podStillExists = allData.podsStatuses.allPodsStatus.some(
        (pod) =>
          pod.podName === clickedPod.podName &&
          pod.namespace === clickedPod.namespace,
      );
      // Only reset the clickedPod state if it no longer exists in the updated data
      if (!podStillExists) {
        setClickedPod({
          podName: "",
          namespace: "",
          containers: [],
          deployment: "",
        });
        setDefaultView(true);
      }
    }
  }, [allData.podsStatuses, clickedPod]);

  // Handle the click outside of the menu to close the menu
  useEffect(() => {
    // Close the menu when clicking outside of the menu
    const handleClickOutside = (event) => {
      if (buttonRef.current?.contains(event.target)) return; // if the button is clicked, bypass

      // Close the menu bar if clicking outside menu and menu is open
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div id="main-container">
      <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 sm:flex-row">
        <div id="leftside" className="flex items-center">
          <div className="flex items-center gap-0 px-5">
            <button
              ref={buttonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="group inline-flex h-12 w-12 items-center justify-center rounded border-2 border-slate-500 bg-slate-950 text-center text-slate-300"
            >
              <span className="sr-only">Menu</span>
              <svg
                className="pointer-events-none h-6 w-6 fill-current"
                viewBox="0 0 16 16"
              >
                <rect
                  className={`origin-center transition-transform duration-300 ${
                    isMenuOpen
                      ? "-translate-x-[0px] translate-y-[0px] rotate-45"
                      : // : "-translate-y-[5px] translate-x-[7px]"
                        "-translate-y-[5px]"
                  }`}
                  y="7"
                  width="16"
                  height="2"
                ></rect>
                <rect
                  className={`origin-center transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-0" : "opacity-100"
                  }`}
                  y="7"
                  width="16"
                  height="2"
                ></rect>
                <rect
                  className={`origin-center transition-transform duration-300 ${
                    isMenuOpen
                      ? "-translate-x-[0px] -translate-y-[0px] -rotate-45"
                      : "translate-y-[5px]"
                  }`}
                  y="7"
                  width="16"
                  height="2"
                ></rect>
              </svg>
            </button>
            <div
              ref={menuRef}
              className={`fixed left-0 top-20 h-screen w-64 transform bg-slate-900 p-4 shadow-lg transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <MenuContainer
                refreshFrequency={refreshFrequency}
                setRefreshFrequency={setRefreshFrequency}
                showRefreshPopup={showRefreshPopup}
                setShowRefreshPopup={setShowRefreshPopup}
                refreshInput={refreshInput}
                setRefreshInput={setRefreshInput}
                manualRefreshCount={manualRefreshCount}
                setManualRefreshCount={setManualRefreshCount}
              />
            </div>
          </div>
          <h1 className="bg-gradient-to-bl from-blue-500 to-blue-600 bg-clip-text px-5 font-sans text-5xl font-bold text-transparent transition duration-300 hover:scale-105">
            BottleNetes
          </h1>
        </div>
        <div className="flex items-center space-x-[50px]">
        <DarkMode />
          <h1 className="mr-5 px-5 text-2xl font-semibold text-slate-300">{`Welcome, ${username}`}</h1>
        </div>
      </header>
      <div className="bg-custom-gradient dark:bg-custom-gradient-dark">
        <div className="border-b-2 border-slate-300 p-6 dark:border-slate-600">
          {/* Overview Display */}
          <Overview
            podsStatuses={allData.podsStatuses}
            allNodes={allData.allNodes}
            // isLoading={isLoading}
          />
        </div>

        {/* PodNameDisplay */}
        <div className="border-b-2 border-slate-300 dark:border-slate-600">
          <PodNameDisplay
            clickedPod={clickedPod}
            setClickedPod={setClickedPod}
          />
        </div>

        {/* Main Container */}
        <div
          id="graph-container"
          className="mt-2 flex min-h-screen flex-col gap-4 p-6 text-slate-100"
        >
          {/*Arrange components in columns for a larger screen, and stack vertically if the screen is smaller*/}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-4">
            {/* Pod Grid */}
            <div
              id="pod-grid"
              className="flex max-h-[100%] flex-col rounded-3xl bg-slate-100 p-4 xl:col-span-2 dark:bg-transparent dark:shadow-custom-lg dark:border-2 dark:border-slate-600"
            >
              <h2 className="text-center text-2xl font-bold text-slate-900 dark:text-slate-300">
                Heat Map
              </h2>
              <PodGrid
                defaultView={defaultView}
                setDefaultView={setDefaultView}
                clickedPod={clickedPod}
                setClickedPod={setClickedPod}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
                podRestartCount={podRestartCount}
                setPodRestartCount={setPodRestartCount}
                podStatuses={allData.podsStatuses}
                cpuUsageOneValue={allData.cpuUsageOneValue}
                memoryUsageOneValue={allData.memoryUsageOneValue}
                requestLimits={allData.requestLimits}
                latencyAppRequestOneValue={allData.latencyAppRequestOneValue}
                queryTimeWindow={queryTimeWindow}
                setQueryTimeWindow={setQueryTimeWindow}
                backendUrl={backendUrl}
              />
            </div>

            {/* Historical Tracing */}
            <div
              id="historical-tracing"
              className="max-h-[100%] rounded-3xl bg-slate-100 p-4 xl:col-span-2 dark:bg-transparent dark:shadow-custom-lg"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-300">
                Historical Tracing
              </h2>
              <Metrics
                defaultView={defaultView}
                clickedPod={clickedPod}
                cpuUsageHistorical={allData.cpuUsageHistorical}
                memoryUsageHistorical={allData.memoryUsageHistorical}
              />
            </div>

            {/* Request vs. Limit */}
            <div
              id="request-vs-limit"
              className="h-[500px] w-full overflow-y-auto rounded-3xl bg-slate-100 p-4 xl:col-span-2 dark:bg-transparent dark:shadow-custom-lg"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-300">
                Request vs. Limit
              </h2>
              <RequestLimit
                defaultView={defaultView}
                clickedPod={clickedPod}
                selectedMetric={selectedMetric}
                requestLimits={allData.requestLimits}
              />
            </div>

            {/* Latency */}
            <div
              id="latency"
              className="rounded-3xl bg-slate-100 p-4 xl:col-span-2 dark:bg-transparent dark:shadow-custom-lg"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-300">
                Request Latency
              </h2>
              <Latency
                defaultView={defaultView}
                clickedPod={clickedPod}
                cpuUsageHistorical={allData.cpuUsageHistorical}
                latencyAppRequestHistorical={
                  allData.latencyAppRequestHistorical
                }
              />
            </div>

            <div id="bottom-buttons" className="mt-4 flex justify-end gap-4">
              {/* removed the reset button because it's redundant */}
              {/* Reset Button with Reset Function */}
              {/* <button
                onClick={resetView}
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
              >
                Reset to default
              </button> */}
              <button
                id="ask-ai-button"
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
              >
                Ask AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

MainContainer.propTypes = {
  username: PropTypes.string,
  backendUrl: PropTypes.string.isRequired,
};

export default MainContainer;
