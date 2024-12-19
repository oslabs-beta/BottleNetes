import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import MenuContainer from "./MenuContainer";
import Overview from "../components/Overview";
import PodNameDisplay from "../components/PodNameDisplay";
import Latency from "../components/Latency";
import Metrics from "../components/Metrics";
import PodGrid from "../components/PodGrid";
import RequestLimit from "../components/RequestLimit";
import Chatbot from "../components/Chatbot";

const MainContainer = ({ username }) => {
  const url = "http://localhost:3000/";

  // State for when the menu button is clicked
  const [menu, setMenu] = useState(false);

  // Determines if the graphs display node data or pod specific data
  const [defaultView, setDefaultView] = useState(true);

  // Which pod has been clicked-  manage selected pod
  const [clickedPod, setClickedPod] = useState("");

  // AI popup window visibility
  const [aiVisibility, setAiVisibility] = useState(false);

  // State to store selected metric to display
  const [selectedMetric, setSelectedMetric] = useState("cpu");

  const [isLoading, setIsLoading] = useState(true);

  // Function to reset views and clear selected pod
  const resetView = () => {
    setDefaultView(true);
    // Reset to default view
    setClickedPod("");
    // Clear selected pod
    setSelectedMetric("cpu");
    // Reset metric selection
  };

  // Data of all pods
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

  //Helper function to fetch all data
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

  // Populate all data with big fetch, run every 30 seconds
  useEffect(() => {
    const bigFetch = async () => {
      setIsLoading(true);

      console.log("Fetching data...");

      const bodyResourceUsageOnevalueCPU = {
        type: "cpu",
        time: "1h",
        level: "pod",
      };

      const bodyResourceUsageOnevalueMemory = {
        type: "memory",
        time: "1h",
        level: "pod",
      };

      const bodyResourceUsageHistoricalCPU = {
        type: "cpu",
        timeEnd: Math.floor(Date.now() / 1000).toString(),
        timeStart: (Math.floor(Date.now() / 1000) - 1200).toString(),
        timeStep: "60",
        level: "pod",
      };

      const bodyResourceUsageHistoricalMemory = {
        type: "memory",
        timeEnd: Math.floor(Date.now() / 1000).toString(),
        timeStart: (Math.floor(Date.now() / 1000) - 1200).toString(),
        timeStep: "60",
        level: "pod",
      };

      const bodyLatencyAppRequestOneValue = {
        time: "1h",
        level: "pod",
      };

      const bodyLatencyAppRequestHistorical = {
        timeEnd: Math.floor(Date.now() / 1000).toString(),
        timeStart: (Math.floor(Date.now() / 1000) - 1200).toString(),
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

    const intervalID = setInterval(bigFetch, 30000);
    return () => {
      clearInterval(intervalID);
    };
  }, []);

  // Console log all data every time state updates
  useEffect(() => {
    console.log("All data: ", allData);
  }, [allData]);

  return (
    <div>
      <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 border-slate-600 bg-slate-950 py-4 sm:flex-row">
        <div id="leftside" className="flex items-center">
          {/* Menu drop down */}
          <div className="flex items-center gap-0 px-5">
            <button
              onClick={() => setMenu(true)}
              className="group inline-flex h-12 w-12 items-center justify-center rounded border-2 border-slate-500 bg-slate-950 text-center text-slate-300"
            >
              <span className="sr-only">Menu</span>
              <svg
                className="pointer-events-none h-6 w-6 fill-current"
                viewBox="0 0 16 16"
              >
                <rect
                  className="origin-center -translate-y-[5px] translate-x-[7px]"
                  y="7"
                  width="9"
                  height="2"
                ></rect>
                <rect
                  className="origin-center"
                  y="7"
                  width="16"
                  height="2"
                ></rect>
                <rect
                  className="origin-center translate-y-[5px]"
                  y="7"
                  width="9"
                  height="2"
                ></rect>
              </svg>
            </button>
            {!menu && <MenuContainer />}
          </div>
          {/* Title */}
          <h1 className="bg-gradient-to-bl from-blue-500 to-blue-600 bg-clip-text px-5 font-sans text-5xl font-bold text-transparent transition duration-300 hover:scale-105">
            BottleNetes
          </h1>
        </div>
        {/* Welcome text */}
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
            isLoading={isLoading}
          />
        </div>

        {/* Pod Name Display */}
        <div className="border-b-2 border-slate-300">
          <PodNameDisplay clickedPod={clickedPod} />
        </div>

        {/* Main Container */}
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
          </div>
        </div>
        {/* Bottom row of buttons */}
        <div className="relative mx-6">
          {/* Conditionally render AI chat window */}
          {aiVisibility && (
            <div className="absolute bottom-[100%] right-0 mb-3 w-72 rounded-lg border-2 border-blue-600 bg-white p-4 shadow-lg">
              <Chatbot allData={allData} fetchData={fetchData} />
            </div>
          )}
          {/* Reset to default and Ask AI buttons*/}
          <div className="flex justify-between pb-5">
            {/* Reset Button with Reset Function */}
            <button
              onClick={resetView}
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
            >
              Reset to default
            </button>
            <button
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
              onClick={() => setAiVisibility(!aiVisibility)}
            >
              Ask AI
            </button>
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
