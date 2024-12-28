/**
 * This component renders the main page with the following components:
 * - MenuContainer.jsx: Displays the menu section with user options
 * - Latency.jsx: Displays the Latency chart
 * - Metrics.jsx: Displays historical data for resource usages
 * - Overview.jsx: Displays the overview of all pods and nodes
 * - RequestLimit.jsx: Displays the Request vs. Limit chart
 * - PodGrid.jsx: Displays the heatmap for pod statuses
 * - PodNameDisplay.jsx: Displays the Namespace, Pod Name, and Deployment
 * - Chatbot.jsx: Displays the AI-powered chatbot popup for user assistance
 *   - Dynamically renders user and AI messages with timestamps
 *   - Includes user profile initials and AI logo in the chat interface
 */

import PropTypes from "prop-types";
import { useState, useRef, useEffect } from "react";

// Hooks Folder
import useFetchData from "../hooks/useFetchData";

// Container Folder
import MenuContainer from "./MenuContainer";

// Component Folder
import Latency from "../components/Latency";
import Metrics from "../components/Metrics";
import Overview from "../components/Overview";
import RequestLimit from "../components/RequestLimit";
import Chatbot from "../components/Chatbot";

// Component/HeatMapComponent Folder
import PodGrid from "../components/HeatMapComponents/PodGrid";
import PodNameDisplay from "../components/HeatMapComponents/PodNameDisplay";

const MainContainer = ({ 
  username, 
  backendUrl,
  allData,
  resetView 
}) => {
  // Determines if the graphs display node data or pod-specific data
  const [defaultView, setDefaultView] = useState(true);

  // State for query time window in PodGrid
  const [queryTimeWindow, setQueryTimeWindow] = useState("1m");

  // State for the currently clicked pod
  const [clickedPod, setClickedPod] = useState({
    podName: "",
    namespace: "",
    containers: [],
    deployment: "",
  });

  // AI popup window visibility
  const [aiVisibility, setAiVisibility] = useState(false);

  // State for the selected metric to display
  const [selectedMetric, setSelectedMetric] = useState("cpu");

  // State for pod restart count
  const [podRestartCount, setPodRestartCount] = useState(0);

  // State for refresh control
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [refreshFrequency, setRefreshFrequency] = useState(30000);
  const [showRefreshPopup, setShowRefreshPopup] = useState(false);
  const [refreshInput, setRefreshInput] = useState("");

  // State for menu sidebar visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Fetch data using a custom hook
  const { isLoading, allData: fetchedData } = useFetchData({
    backendUrl,
    refreshFrequency,
    queryTimeWindow,
    podRestartCount,
    manualRefreshCount,
  });

  // Handle the click outside the menu to close the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current?.contains(event.target)) return; // Ignore button clicks
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close the menu
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reset the view to default state
  const resetView = () => {
    setDefaultView(true); // Reset to default node data view
    setClickedPod(""); // Clear clicked pod selection
    setSelectedMetric("cpu"); // Reset metric to CPU
  };

  return (
    <div>
      <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 sm:flex-row">
        <div id="leftside" className="flex items-center">
          {/* Menu drop-down */}
          <div className="flex items-center gap-0 px-5">
            <button
              ref={buttonRef}
              onClick={() => setAiVisibility(!aiVisibility)}
              className="group inline-flex h-12 w-12 items-center justify-center rounded border-2 border-slate-500 bg-slate-950 text-center text-slate-300"
            >
              <span className="sr-only">Menu</span>
            </button>
            <div
              ref={menuRef}
              className={`fixed left-0 top-20 h-screen w-64 transform bg-slate-900 p-4 shadow-lg transition-transform duration-300 ease-in-out ${
                aiVisibility ? "translate-x-0" : "-translate-x-full"
              }`}
            ></div>
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
        <div className="relative mx-6">
          {/* Previously, Chatbot was rendered without the username prop */}
          {/* Old Code: */}
          {/* 
          <div className="relative mx-6">
            {aiVisibility && (
              <div className="absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl">
                <Chatbot allData={allData} />
              </div>
            )}
          </div>
          */}
          {/* Updated Chatbot rendering with username prop */}
          {aiVisibility && (
            <div className="absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl">
              <Chatbot
                allData={fetchedData}
                fetchData={(method, endpoint, body) =>
                  fetch(`${backendUrl}/${endpoint}`, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  }).then((res) => res.json())
                }
                username={username} // Pass username to Chatbot for profile initials
              />
              {/* 
                Why this change?
                - Added `username` prop to pass the username to Chatbot.
                - The Chatbot requires `username` to display the user's initials in the avatar.
              */}
            </div>
          )}

          {/* Reset to default and Ask AI buttons */}
          <div className="flex justify-between pb-5">
            {/* Reset Button */}
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
  username: PropTypes.string.isRequired, // Validate username prop
  backendUrl: PropTypes.string.isRequired, // Validate backend URL prop
  allData: PropTypes.object.isRequired, // Validate allData prop
  resetView: PropTypes.func.isRequired, // Validate resetView function
};

export default MainContainer;

    
  // Previously, Chatbot was rendered without the username prop 
  // /Old Code: 
  // <div className="relative mx-6">
  //   {aiVisibility && (
  //     <div className="absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl">
  //       <Chatbot allData={allData} />
  //     </div>
  //   )}
  // </div>
  // 
            
  // Why this change?
  // - Added `username` prop to pass the username to Chatbot.
  // - The Chatbot requires `username` to display the user's initials in the avatar.
                
       
  // FETCH HELPER FUNC, OUTDATED
  // const fetchData = async (method, endpoint, body = null) => {
  //   try {
  //     const request = {
  //       method: method,
  //       headers: { "Content-Type": "application/json" },
  //     };
  //     if (body) request.body = JSON.stringify(body);
  //     const response = await fetch(url + endpoint, request);

  //     return await response.json();
  //   } catch (error) {
  //     console.error("Fetch error:", error);
  //     return null;
  //   }
  // };

  // BIG FETCH RUNNING EVERY 30 SECS, OUTDATED
  // useEffect(() => {
  //   const bigFetch = async () => {
  //     // setIsLoading(true);

  //     console.log("Fetching data...");

  //     const bodyResourceUsageOnevalueCPU = {
  //       type: "cpu",
  //       time: queryTimeWindow,
  //       level: "pod",
  //     };

  //     const bodyResourceUsageOnevalueMemory = {
  //       type: "memory",
  //       time: queryTimeWindow,
  //       level: "pod",
  //     };

  //     const bodyResourceUsageHistoricalCPU = {
  //       type: "cpu",
  //       timeEnd: Math.floor(Date.now() / 1000).toString(),
  //       timeStart: (Math.floor(Date.now() / 1000) - 1200).toString(),
  //       timeStep: "60",
  //       level: "pod",
  //     };

  //     const bodyResourceUsageHistoricalMemory = {
  //       type: "memory",
  //       timeEnd: Math.floor(Date.now() / 1000).toString(),
  //       timeStart: (Math.floor(Date.now() / 1000) - 1200).toString(),
  //       timeStep: "60",
  //       level: "pod",
  //     };

  //     const bodyLatencyAppRequestOneValue = {
  //       time: queryTimeWindow,
  //       level: "pod",
  //     };

  //     const bodyLatencyAppRequestHistorical = {
  //       timeEnd: Math.floor(Date.now() / 1000).toString(),
  //       timeStart: (Math.floor(Date.now() / 1000) - 1200).toString(),
  //       timeStep: "60",
  //       level: "pod",
  //     };

  //     try {
  //       const fakeNodeData = {
  //         allNodes: [
  //           {
  //             nodeName: "Minikube",
  //             clusterName: "Minikube",
  //           },
  //         ],
  //       };

  //       const [
  //         status,
  //         requestLimits,
  //         cpuUsageOneValue,
  //         memoryUsageOneValue,
  //         cpuUsageHistorical,
  //         memoryUsageHistorical,
  //         latencyAppRequestOneValue,
  //         latencyAppRequestHistorical,
  //       ] = await Promise.all([
  //         fetchData("GET", "api/all-pods-status"),
  //         fetchData("GET", "api/all-pods-request-limit"),
  //         // fetchData("GET", "api/allnodes") CURRENTLY POPULATED WITH FAKE DATA
  //         fetchData(
  //           "POST",
  //           "api/resource-usage-onevalue",
  //           bodyResourceUsageOnevalueCPU,
  //         ),
  //         fetchData(
  //           "POST",
  //           "api/resource-usage-onevalue",
  //           bodyResourceUsageOnevalueMemory,
  //         ),
  //         fetchData(
  //           "POST",
  //           "api/resource-usage-historical",
  //           bodyResourceUsageHistoricalCPU,
  //         ),
  //         fetchData(
  //           "POST",
  //           "api/resource-usage-historical",
  //           bodyResourceUsageHistoricalMemory,
  //         ),
  //         fetchData(
  //           "POST",
  //           "api/latency-app-request-onevalue",
  //           bodyLatencyAppRequestOneValue,
  //         ),
  //         fetchData(
  //           "POST",
  //           "api/latency-app-request-historical",
  //           bodyLatencyAppRequestHistorical,
  //         ),
  //       ]);
  //       // console.log( "DATA FROM BACKEND",
  //       //   status,
  //       //   requestLimits,
  //       //   cpuUsageOneValue,
  //       //   memoryUsageOneValue,
  //       //   cpuUsageHistorical,
  //       // );
  //       setAllData({
  //         podsStatuses: status || [],
  //         requestLimits: requestLimits || [],
  //         allNodes: fakeNodeData,
  //         cpuUsageOneValue: cpuUsageOneValue || [],
  //         memoryUsageOneValue: memoryUsageOneValue || [],
  //         cpuUsageHistorical: cpuUsageHistorical || [],
  //         memoryUsageHistorical: memoryUsageHistorical || [],
  //         latencyAppRequestOneValue: latencyAppRequestOneValue || [],
  //         latencyAppRequestHistorical: latencyAppRequestHistorical || [],
  //       });
  //     } catch (error) {
  //       console.error("Error fetching initial data:", error);
  //     } finally {
  //       // setIsLoading(false);
  //     }
  //   };
  //   bigFetch();

  //   const intervalID = setInterval(bigFetch, refreshFrequency);
  //   return () => {
  //     clearInterval(intervalID);
  //   };
  // }, [refreshFrequency, manualRefreshCount, queryTimeWindow]);

//   return (
//     <div>
//       <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 sm:flex-row">
//         <div id="leftside" className="flex items-center">
//           {/* Menu drop down */}
//           <div className="flex items-center gap-0 px-5">
//             <button
//               ref={buttonRef}
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="group inline-flex h-12 w-12 items-center justify-center rounded border-2 border-slate-500 bg-slate-950 text-center text-slate-300"
//             >
//               <span className="sr-only">Menu</span>
//               <svg
//                 className="pointer-events-none h-6 w-6 fill-current"
//                 viewBox="0 0 16 16"
//               >
//                 <rect
//                   className={`origin-center transition-transform duration-300 ${
//                     isMenuOpen
//                       ? "-translate-x-[0px] translate-y-[0px] rotate-45"
//                       : // : "-translate-y-[5px] translate-x-[7px]"
//                         "-translate-y-[5px]"
//                   }`}
//                   y="7"
//                   width="16"
//                   height="2"
//                 ></rect>
//                 <rect
//                   className={`origin-center transition-opacity duration-300 ${
//                     isMenuOpen ? "opacity-0" : "opacity-100"
//                   }`}
//                   y="7"
//                   width="16"
//                   height="2"
//                 ></rect>
//                 <rect
//                   className={`origin-center transition-transform duration-300 ${
//                     isMenuOpen
//                       ? "-translate-x-[0px] -translate-y-[0px] -rotate-45"
//                       : "translate-y-[5px]"
//                   }`}
//                   y="7"
//                   width="16"
//                   height="2"
//                 ></rect>
//               </svg>
//             </button>
//             <div
//               ref={menuRef}
//               className={`fixed left-0 top-20 h-screen w-64 transform bg-slate-900 p-4 shadow-lg transition-transform duration-300 ease-in-out ${
//                 isMenuOpen ? "translate-x-0" : "-translate-x-full"
//               }`}
//             >
//               <MenuContainer
//                 refreshFrequency={refreshFrequency}
//                 setRefreshFrequency={setRefreshFrequency}
//                 showRefreshPopup={showRefreshPopup}
//                 setShowRefreshPopup={setShowRefreshPopup}
//                 refreshInput={refreshInput}
//                 setRefreshInput={setRefreshInput}
//                 manualRefreshCount={manualRefreshCount}
//                 setManualRefreshCount={setManualRefreshCount}
//               />
//             </div>
//           </div>
//           {/* Title */}
//           <h1 className="bg-gradient-to-bl from-blue-500 to-blue-600 bg-clip-text px-5 font-sans text-5xl font-bold text-transparent transition duration-300 hover:scale-105">
//             BottleNetes
//           </h1>
//         </div>
//         {/* Welcome text */}
//         <div className="flex items-center space-x-4">
//           <h1 className="mr-5 px-5 text-2xl font-semibold text-slate-300">{`Welcome, ${username}`}</h1>
//         </div>
//       </header>
//       <div className="bg-custom-gradient">
//         <div className="border-b-2 border-slate-300 p-6">
//           {/* Overview Display */}
//           <Overview
//             podsStatuses={allData.podsStatuses}
//             allNodes={allData.allNodes}
//             // isLoading={isLoading}
//           />
//         </div>

//         {/* Pod Name Display */}
//         <div className="border-b-2 border-slate-300">
//           <PodNameDisplay
//             clickedPod={clickedPod}
//             setClickedPod={setClickedPod}
//           />
//         </div>

//         {/* Main Container */}
//         <div
//           id="main-container"
//           className="mt-2 flex min-h-screen flex-col gap-4 p-6 text-slate-100"
//         >
//           {/*Arrange components in columns for a larger screen, and stack vertically if the screen is smaller*/}
//           <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-4">
//             {/* Pod Grid */}
//             <div
//               id="pod-grid"
//               className="flex max-h-[100%] flex-col rounded-3xl border-4 border-slate-400 bg-slate-100 p-4 xl:col-span-2"
//             >
//               <h2 className="text-center text-2xl font-bold text-slate-900">
//                 Select Pod
//               </h2>
//               <PodGrid
//                 defaultView={defaultView}
//                 setDefaultView={setDefaultView}
//                 clickedPod={clickedPod}
//                 setClickedPod={setClickedPod}
//                 selectedMetric={selectedMetric}
//                 setSelectedMetric={setSelectedMetric}
//                 podRestartCount={podRestartCount}
//                 setPodRestartCount={setPodRestartCount}
//                 podStatuses={allData.podsStatuses}
//                 cpuUsageOneValue={allData.cpuUsageOneValue}
//                 memoryUsageOneValue={allData.memoryUsageOneValue}
//                 latencyAppRequestOneValue={allData.latencyAppRequestOneValue}
//                 queryTimeWindow={queryTimeWindow}
//                 setQueryTimeWindow={setQueryTimeWindow}
//                 backendUrl={backendUrl}
//               />
//             </div>

//             {/* Historical Tracing */}
//             <div
//               id="historical-tracing"
//               className="max-h-[100%] rounded-3xl bg-slate-100 p-4 xl:col-span-2"
//             >
//               <h2 className="text-center text-2xl font-semibold text-slate-900">
//                 Historical Tracing
//               </h2>
//               <Metrics
//                 defaultView={defaultView}
//                 clickedPod={clickedPod}
//                 cpuUsageHistorical={allData.cpuUsageHistorical}
//                 memoryUsageHistorical={allData.memoryUsageHistorical}
//               />
//             </div>

//             {/* Request vs. Limit */}
//             <div
//               id="request-vs-limit"
//               className="relative flex-auto rounded-3xl bg-slate-100 p-4 xl:col-span-2"
//             >
//               <h2 className="text-center text-2xl font-semibold text-slate-900">
//                 Request vs. Limit
//               </h2>
//               <RequestLimit
//                 defaultView={defaultView}
//                 clickedPod={clickedPod}
//                 selectedMetric={selectedMetric}
//                 requestLimits={allData.requestLimits}
//               />
//             </div>

//             {/* Latency */}
//             <div
//               id="latency"
//               className="rounded-3xl bg-slate-100 p-4 xl:col-span-2"
//             >
//               <h2 className="text-center text-2xl font-semibold text-slate-900">
//                 Request Latency
//               </h2>
//               <Latency
//                 defaultView={defaultView}
//                 clickedPod={clickedPod}
//                 cpuUsageHistorical={allData.cpuUsageHistorical}
//                 latencyAppRequestHistorical={
//                   allData.latencyAppRequestHistorical
//                 }
//               />
//             </div>
//           </div>
//         </div>
//         {/* Bottom row of buttons */}
//         <div className="relative mx-6">
//           {/* Conditionally render AI chat window */}
//           {aiVisibility && (
//             <div className="absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl">
//               <Chatbot allData={allData} />
//             </div>
//           )}
//           {/* Reset to default and Ask AI buttons*/}
//           <div className="flex justify-between pb-5">
//             {/* Reset Button with Reset Function */}
//             <button
//               onClick={resetView}
//               className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
//             >
//               Reset to default
//             </button>
//             <button
//               className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90 hover:filter"
//               onClick={() => setAiVisibility(!aiVisibility)}
//             >
//               Ask AI
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// MainContainer.propTypes = {
//   username: PropTypes.string,
//   backendUrl: PropTypes.string.isRequired,
// };

// export default MainContainer;
