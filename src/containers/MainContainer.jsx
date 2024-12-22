import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

import MenuContainer from "./MenuContainer";
import Overview from "../components/Overview";
import PodNameDisplay from "../components/PodNameDisplay";
import Latency from "../components/Latency";
import Metrics from "../components/Metrics";
import PodGrid from "../components/PodGrid";
import RequestLimit from "../components/RequestLimit";

const MainContainer = ({ username }) => {
  // console.log("main container rendering");
  const url = "http://localhost:3000/";

  // Determines if the graphs display node data or pod specific data
  const [defaultView, setDefaultView] = useState(true);

  const [isLoading, setIsLoading] = useState(true);

  // state hooks for time window in PodGrid
  const [queryTimeWindow, setQueryTimeWindow] = useState("1m");
  const [showTimeWindow, setShowTimeWindow] = useState(false);
  const [timeInput, setTimeInput] = useState("");
  const [timeUnit, setTimeUnit] = useState("m");
  const [showTooltip, setShowTooltip] = useState(false);

  // state hooks for clicked pod and selected metric in PodGrid (will also be passed down to other components)
  const [clickedPod, setClickedPod] = useState("");
  const [selectedMetric, setSelectedMetric] = useState("cpu");

  // State hooks for refresh control in MenuContainer
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [refreshFrequency, setRefreshFrequency] = useState(30000);
  const [showRefreshPopup, setShowRefreshPopup] = useState(false);
  const [refreshInput, setRefreshInput] = useState("");

  // State hook for all data fetched from the backend
  const [allData, setAllData] = useState({
    podsStatuses: { podsStatuses: [] },
    requestLimits: { allPodsRequestLimit: [] },
    allNodes: { allNodes: [] },
    cpuUsageOneValue: { resourceUsageOneValue: [] },
    memoryUsageOneValue: { resourceUsageOneValue: [] },
    cpuUsageHistorical: null,
    memoryUsageHistorical: null,
    latencyAppRequestOneValue: { latencyAppRequestOneValue: [] },
  });

  // handling menu bar toggle
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Bypass if clicking the menu button itself
      if (buttonRef.current && buttonRef.current.contains(event.target)) {
        return;
      }
      // Close the menu bar if clicking outside menu and menu is open
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to reset views and clear selected pod
  const resetView = () => {
    setDefaultView(true);
    // Reset to default view
    setClickedPod("");
    // Clear selected pod
    setSelectedMetric("cpu");
    // Reset metric selection
  };

  // for testing purposes, delete afterwards
  useEffect(() => {
    console.log("time window: ", queryTimeWindow);
  }, [queryTimeWindow]);

  //helper function
  const fetchData = async (method, endpoint, body = null) => {
    try {
      const request = {
        method: method,
        headers: { "Content-Type": "application/json" },
      };
      if (body) request.body = JSON.stringify(body);
      const response = await fetch(url + endpoint, request);

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return null;
    }
  };

  // Populate all pod status and pods request limit
  // Run big fetch once every 30 seconds
  useEffect(() => {
    const bigFetch = async () => {
      setIsLoading(true);

      console.log("Fetching data...");

      const bodyResourceUsageOnevalueCPU = {
        type: "cpu",
        time: queryTimeWindow,
        level: "pod",
      };

      const bodyResourceUsageOnevalueMemory = {
        type: "memory",
        time: queryTimeWindow,
        level: "pod",
      };

      const bodyResourceUsageHistoricalCPU = {
        type: "cpu",
        timeEnd: Math.floor(Date.now() / 1000).toString(),
        timeStart: (Math.floor(Date.now() / 1000) - 86400).toString(),
        timeStep: "60",
        level: "pod",
      };

      const bodyResourceUsageHistoricalMemory = {
        type: "memory",
        timeEnd: Math.floor(Date.now() / 1000).toString(),
        timeStart: (Math.floor(Date.now() / 1000) - 86400).toString(),
        timeStep: "60",
        level: "pod",
      };

      const bodyLatencyAppRequestOneValue = {
        time: queryTimeWindow,
        level: "pod",
      };

      const bodyLatencyAppRequestHistorical = {
        timeEnd: Math.floor(Date.now() / 1000).toString(),
        timeStart: (Math.floor(Date.now() / 1000) - 86400).toString(),
        timeStep: "60",
        level: "pod",
      };

      try {
        const fakeNodeData = {
          allNodes: [
            {
              nodeName: "Minikube",
              clusterName: "Minikube",
            },
          ],
        };

        const [
          status,
          requestLimits,
          cpuUsageOneValue,
          memoryUsageOneValue,
          cpuUsageHistorical,
          memoryUsageHistorical,
          latencyAppRequestOneValue,
          latencyAppRequestHistorical,
        ] = await Promise.all([
          fetchData("GET", "api/all-pods-status"),
          fetchData("GET", "api/all-pods-request-limit"),
          // fetchData("GET", "api/allnodes") CURRENTLY POPULATED WITH FAKE DATA
          fetchData(
            "POST",
            "api/resource-usage-onevalue",
            bodyResourceUsageOnevalueCPU,
          ),
          fetchData(
            "POST",
            "api/resource-usage-onevalue",
            bodyResourceUsageOnevalueMemory,
          ),
          fetchData(
            "POST",
            "api/resource-usage-historical",
            bodyResourceUsageHistoricalCPU,
          ),
          fetchData(
            "POST",
            "api/resource-usage-historical",
            bodyResourceUsageHistoricalMemory,
          ),
          fetchData(
            "POST",
            "api/latency-app-request-onevalue",
            bodyLatencyAppRequestOneValue,
          ),
          fetchData(
            "POST",
            "api/latency-app-request-historical",
            bodyLatencyAppRequestHistorical,
          ),
        ]);
        // console.log( "DATA FROM BACKEND",
        //   status,
        //   requestLimits,
        //   cpuUsageOneValue,
        //   memoryUsageOneValue,
        //   cpuUsageHistorical,
        // );
        setAllData({
          podsStatuses: status || [],
          requestLimits: requestLimits || [],
          allNodes: fakeNodeData,
          cpuUsageOneValue: cpuUsageOneValue || [],
          memoryUsageOneValue: memoryUsageOneValue || [],
          cpuUsageHistorical: cpuUsageHistorical || [],
          memoryUsageHistorical: memoryUsageHistorical || [],
          latencyAppRequestOneValue: latencyAppRequestOneValue || [],
          latencyAppRequestHistorical: latencyAppRequestHistorical || [],
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    bigFetch();

    const intervalID = setInterval(bigFetch, refreshFrequency);
    return () => {
      clearInterval(intervalID);
    };
  }, [refreshFrequency, manualRefreshCount, queryTimeWindow]);

  // useEffect(() => {
  //   console.log("All data: ", allData);
  // }, [allData]);

  return (
    <div>
      <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 border-slate-600 bg-slate-950 py-4 sm:flex-row">
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
        <div className="flex items-center space-x-4">
          <h1 className="mr-5 px-5 text-2xl font-semibold text-slate-300">{`Welcome, ${username}`}</h1>
        </div>
      </header>
      <div className="bg-custom-gradient">
        <div className="border-b-2 border-slate-300 p-6">
          {/* Overview Display */}
          <Overview
            podsStatuses={allData.podsStatuses}
            allNodes={allData.allNodes}
            // isLoading={isLoading}
          />
        </div>

        {/* PodNameDisplay */}
        <div className="border-b-2 border-slate-300">
          <PodNameDisplay clickedPod={clickedPod} />
        </div>

        {/* main container */}
        <div
          id="main-container"
          className="mt-2 flex min-h-screen flex-col gap-4 p-6 text-slate-100"
        >
          {/*Arrange components in columns for a larger screen, and stack vertically if the screen is smaller*/}
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-4">
            {/* Pod Grid */}
            <div className="flex max-h-[100%] flex-col rounded-3xl border-4 border-slate-400 bg-slate-100 p-4 xl:col-span-2">
              <h2 className="text-center text-2xl font-bold text-slate-900">
                Select Pod
              </h2>
              <PodGrid
                defaultView={defaultView}
                setDefaultView={setDefaultView}
                clickedPod={clickedPod}
                setClickedPod={setClickedPod}
                selectedMetric={selectedMetric}
                setSelectedMetric={setSelectedMetric}
                podStatuses={allData.podsStatuses}
                cpuUsageOneValue={allData.cpuUsageOneValue}
                memoryUsageOneValue={allData.memoryUsageOneValue}
                latencyAppRequestOneValue={allData.latencyAppRequestOneValue}
                queryTimeWindow={queryTimeWindow}
                setQueryTimeWindow={setQueryTimeWindow}
                showTimeWindow={showTimeWindow}
                setShowTimeWindow={setShowTimeWindow}
                timeInput={timeInput}
                setTimeInput={setTimeInput}
                timeUnit={timeUnit}
                setTimeUnit={setTimeUnit}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
              />
            </div>

            {/* Historical Tracing */}
            <div className="max-h-[100%] rounded-3xl bg-slate-100 p-4 xl:col-span-2">
              <h2 className="text-center text-2xl font-semibold text-slate-900">
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
            <div className="relative flex-auto rounded-3xl bg-slate-100 p-4 xl:col-span-2">
              <h2 className="text-center text-2xl font-semibold text-slate-900">
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
            <div className="rounded-3xl bg-slate-100 p-4 xl:col-span-2">
              <h2 className="text-center text-2xl font-semibold text-slate-900">
                Request Latency
              </h2>
              <Latency
                defaultView={defaultView}
                clickedPod={clickedPod}
                latencyAppRequestHistorical={
                  allData.latencyAppRequestHistorical
                }
              />
            </div>

            <div className="mt-4 flex justify-end gap-4">
              {/* Reset Button with Reset Function */}
              <button
                onClick={resetView}
                className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
              >
                Reset to default
              </button>
              <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter">
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
};

export default MainContainer;
