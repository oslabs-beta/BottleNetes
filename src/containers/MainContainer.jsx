/**
 * This component renders the main page with the following functionalities:
 * - MenuContainer.jsx: Manages the menu section with user options.
 * - Latency.jsx: Displays latency metrics for request performance.
 * - Metrics.jsx: Shows historical resource usage data (CPU/Memory).
 * - Overview.jsx: Provides a summary of all pods and nodes.
 * - RequestLimit.jsx: Compares request and limit metrics visually.
 * - PodGrid.jsx: Displays pod statuses in a heatmap format.
 * - PodNameDisplay.jsx: Displays namespace, pod name, and deployment details.
 * - Chatbot.jsx: Integrates an AI-powered chatbot for user assistance.
 *   - Renders user and AI messages with dynamic timestamps.
 *   - Includes user initials in profile avatars and branded AI logos.
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

// HeatMap Component Folder
import PodGrid from "../components/HeatMapComponents/PodGrid";
import PodNameDisplay from "../components/HeatMapComponents/PodNameDisplay";

const MainContainer = ({ username, backendUrl, resetView }) => {
  // State management
  const [defaultView, setDefaultView] = useState(true);
  const [queryTimeWindow, setQueryTimeWindow] = useState("1m");
  const [clickedPod, setClickedPod] = useState({
    podName: "",
    namespace: "",
    containers: [],
    deployment: "",
  });
  const [aiVisibility, setAiVisibility] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("cpu");
  const [podRestartCount, setPodRestartCount] = useState(0);
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [refreshFrequency, setRefreshFrequency] = useState(30000);
  const [showRefreshPopup, setShowRefreshPopup] = useState(false);
  const [refreshInput, setRefreshInput] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Fetch data using a custom hook
  const { allData = {} } = useFetchData({
    backendUrl,
    refreshFrequency,
    queryTimeWindow,
    podRestartCount,
    manualRefreshCount,
  });

  // Automatically close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current?.contains(event.target)) return;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div>
      <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 sm:flex-row">
        <div id="leftside" className="flex items-center">
          {/* Menu drop down */}
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
                      : "-translate-y-[5px]"
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
            podsStatuses={allData.podsStatuses || []}
            allNodes={allData.allNodes || []}
          />
        </div>

        {/* Pod Name Display */}
        <div className="border-b-2 border-slate-300">
          <PodNameDisplay
            clickedPod={clickedPod}
            setClickedPod={setClickedPod}
          />
        </div>

        {/* Main Container */}
        <div
          id="main-container"
          className="mt-2 flex min-h-screen flex-col gap-4 p-6 text-slate-100"
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-4">
            {/* Pod Grid */}
            <div
              id="pod-grid"
              className="flex max-h-[100%] flex-col rounded-3xl border-4 border-slate-400 bg-slate-100 p-4 xl:col-span-2"
            >
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
                podRestartCount={podRestartCount}
                setPodRestartCount={setPodRestartCount}
                podStatuses={allData.podsStatuses || []}
                cpuUsageOneValue={allData.cpuUsageOneValue || []}
                memoryUsageOneValue={allData.memoryUsageOneValue || []}
                latencyAppRequestOneValue={allData.latencyAppRequestOneValue || []}
                queryTimeWindow={queryTimeWindow}
                setQueryTimeWindow={setQueryTimeWindow}
                backendUrl={backendUrl}
              />
            </div>

            {/* Historical Tracing */}
            <div
              id="historical-tracing"
              className="max-h-[100%] rounded-3xl bg-slate-100 p-4 xl:col-span-2"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900">
                Historical Tracing
              </h2>
              <Metrics
                defaultView={defaultView}
                clickedPod={clickedPod}
                cpuUsageHistorical={allData.cpuUsageHistorical || []}
                memoryUsageHistorical={allData.memoryUsageHistorical || []}
              />
            </div>

            {/* Request vs. Limit */}
            <div
              id="request-vs-limit"
              className="relative flex-auto rounded-3xl bg-slate-100 p-4 xl:col-span-2"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900">
                Request vs. Limit
              </h2>
              <RequestLimit
                defaultView={defaultView}
                clickedPod={clickedPod}
                selectedMetric={selectedMetric}
                requestLimits={allData.requestLimits || []}
              />
            </div>

            {/* Latency */}
            <div
              id="latency"
              className="rounded-3xl bg-slate-100 p-4 xl:col-span-2"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900">
                Request Latency
              </h2>
              <Latency
                defaultView={defaultView}
                clickedPod={clickedPod}
                cpuUsageHistorical={allData.cpuUsageHistorical || []}
                latencyAppRequestHistorical={
                  allData.latencyAppRequestHistorical || []
                }
              />
            </div>
          </div>
        </div>
        {/* Bottom row of buttons */}
        <div className="relative mx-6">
          {/* AI Chatbot */}
          {aiVisibility && (
            <div className="absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl">
              <Chatbot
                allData={allData}
                fetchData={(method, endpoint, body) =>
                  fetch(`${backendUrl}/${endpoint}`, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                  }).then((res) => res.json())
                }
                username={username}
              />
            </div>
          )}
          {/* Reset and Ask AI buttons */}
          <div className="flex justify-between pb-5">
            <button
              onClick={resetView}
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90"
            >
              Reset to Default
            </button>
            <button
              onClick={() => setAiVisibility(!aiVisibility)}
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90"
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
  username: PropTypes.string.isRequired,
  backendUrl: PropTypes.string.isRequired,
  resetView: PropTypes.func.isRequired,
};

export default MainContainer;

// import PropTypes from "prop-types";
// import { useState, useRef, useEffect } from "react";

// // Hooks Folder
// import useFetchData from "../hooks/useFetchData";

// // Container Folder
// import MenuContainer from "./MenuContainer";

// // Component Folder
// import Latency from "../components/Latency";
// import Metrics from "../components/Metrics";
// import Overview from "../components/Overview";
// import RequestLimit from "../components/RequestLimit";
// import Chatbot from "../components/Chatbot";

// // HeatMap Component Folder
// import PodGrid from "../components/HeatMapComponents/PodGrid";
// import PodNameDisplay from "../components/HeatMapComponents/PodNameDisplay";

// const MainContainer = ({ username, backendUrl, allData, resetView, }) => {
//   // Manages whether data displays node-level or pod-specific details.
//   const [defaultView, setDefaultView] = useState(true);

//   // Time window for pod grid queries (default to "1m").
//   const [queryTimeWindow, setQueryTimeWindow] = useState("1m");

//   // Stores information about the selected pod.
//   const [clickedPod, setClickedPod] = useState({
//     podName: "",
//     namespace: "",
//     containers: [],
//     deployment: "",
//   });

//   // State to manage AI Chatbot visibility.
//   const [aiVisibility, setAiVisibility] = useState(false);

//   // Stores the currently selected metric for display (default to "CPU").
//   const [selectedMetric, setSelectedMetric] = useState("cpu");

//   // Tracks pod restart counts.
//   const [podRestartCount, setPodRestartCount] = useState(0);

//   // State variables for refresh control in the MenuContainer.
//   const [manualRefreshCount, setManualRefreshCount] = useState(0);
//   const [refreshFrequency, setRefreshFrequency] = useState(30000);
//   const [showRefreshPopup, setShowRefreshPopup] = useState(false);
//   const [refreshInput, setRefreshInput] = useState("");

//   // Sidebar menu visibility and references for event listeners.
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const menuRef = useRef(null);
//   const buttonRef = useRef(null);

//   // Fetch data using a custom hook (only extract needed values).
//   const { allData: fetchedData = {} } = useFetchData({
//     backendUrl,
//     refreshFrequency,
//     queryTimeWindow,
//     podRestartCount,
//     manualRefreshCount,
//   });
  
//   const allData = fetchedData || {};

//   // Automatically close the menu when clicking outside.
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (buttonRef.current?.contains(event.target)) return; // Ignore clicks on the menu button.
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsMenuOpen(false); // Close menu if clicking outside.
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//     return (
//       <div>
//         <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 sm:flex-row">
//           <div id="leftside" className="flex items-center">
//             {/* Menu drop down */}
//             <div className="flex items-center gap-0 px-5">
//               <button
//                 ref={buttonRef}
//                 onClick={() => setIsMenuOpen(!isMenuOpen)}
//                 className="group inline-flex h-12 w-12 items-center justify-center rounded border-2 border-slate-500 bg-slate-950 text-center text-slate-300"
//               >
//                 <span className="sr-only">Menu</span>
//                 <svg
//                   className="pointer-events-none h-6 w-6 fill-current"
//                   viewBox="0 0 16 16"
//                 >
//                   <rect
//                     className={`origin-center transition-transform duration-300 ${
//                       isMenuOpen
//                         ? "-translate-x-[0px] translate-y-[0px] rotate-45"
//                         : "-translate-y-[5px]"
//                     }`}
//                     y="7"
//                     width="16"
//                     height="2"
//                   ></rect>
//                   <rect
//                     className={`origin-center transition-opacity duration-300 ${
//                       isMenuOpen ? "opacity-0" : "opacity-100"
//                     }`}
//                     y="7"
//                     width="16"
//                     height="2"
//                   ></rect>
//                   <rect
//                     className={`origin-center transition-transform duration-300 ${
//                       isMenuOpen
//                         ? "-translate-x-[0px] -translate-y-[0px] -rotate-45"
//                         : "translate-y-[5px]"
//                     }`}
//                     y="7"
//                     width="16"
//                     height="2"
//                   ></rect>
//                 </svg>
//               </button>
//               <div
//                 ref={menuRef}
//                 className={`fixed left-0 top-20 h-screen w-64 transform bg-slate-900 p-4 shadow-lg transition-transform duration-300 ease-in-out ${
//                   isMenuOpen ? "translate-x-0" : "-translate-x-full"
//                 }`}
//               >
//                 <MenuContainer
//                   refreshFrequency={refreshFrequency}
//                   setRefreshFrequency={setRefreshFrequency}
//                   showRefreshPopup={showRefreshPopup}
//                   setShowRefreshPopup={setShowRefreshPopup}
//                   refreshInput={refreshInput}
//                   setRefreshInput={setRefreshInput}
//                   manualRefreshCount={manualRefreshCount}
//                   setManualRefreshCount={setManualRefreshCount}
//                 />
//               </div>
//             </div>
//             {/* Title */}
//             <h1 className="bg-gradient-to-bl from-blue-500 to-blue-600 bg-clip-text px-5 font-sans text-5xl font-bold text-transparent transition duration-300 hover:scale-105">
//               BottleNetes
//             </h1>
//           </div>
//           {/* Welcome text */}
//           <div className="flex items-center space-x-4">
//             <h1 className="mr-5 px-5 text-2xl font-semibold text-slate-300">{`Welcome, ${username}`}</h1>
//           </div>
//         </header>
//         <div className="bg-custom-gradient">
//           <div className="border-b-2 border-slate-300 p-6">
//             {/* Overview Display */}
//             <Overview
//               podsStatuses={allData.podsStatuses}
//               allNodes={allData.allNodes}
//             />
//           </div>
    
//           {/* Pod Name Display */}
//           <div className="border-b-2 border-slate-300">
//             <PodNameDisplay
//               clickedPod={clickedPod}
//               setClickedPod={setClickedPod}
//             />
//           </div>
    
//           {/* Main Container */}
//           <div
//             id="main-container"
//             className="mt-2 flex min-h-screen flex-col gap-4 p-6 text-slate-100"
//           >
//             {/* Arrange components in columns for a larger screen, and stack vertically if the screen is smaller */}
//             <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 xl:grid-cols-4">
//               {/* Pod Grid */}
//               <div
//                 id="pod-grid"
//                 className="flex max-h-[100%] flex-col rounded-3xl border-4 border-slate-400 bg-slate-100 p-4 xl:col-span-2"
//               >
//                 <h2 className="text-center text-2xl font-bold text-slate-900">
//                   Select Pod
//                 </h2>
//                 <PodGrid
//                   defaultView={defaultView}
//                   setDefaultView={setDefaultView}
//                   clickedPod={clickedPod}
//                   setClickedPod={setClickedPod}
//                   selectedMetric={selectedMetric}
//                   setSelectedMetric={setSelectedMetric}
//                   podRestartCount={podRestartCount}
//                   setPodRestartCount={setPodRestartCount}
//                   podStatuses={allData.podsStatuses}
//                   cpuUsageOneValue={allData.cpuUsageOneValue}
//                   memoryUsageOneValue={allData.memoryUsageOneValue}
//                   latencyAppRequestOneValue={allData.latencyAppRequestOneValue}
//                   queryTimeWindow={queryTimeWindow}
//                   setQueryTimeWindow={setQueryTimeWindow}
//                   backendUrl={backendUrl}
//                 />
//               </div>
    
//               {/* Historical Tracing */}
//               <div
//                 id="historical-tracing"
//                 className="max-h-[100%] rounded-3xl bg-slate-100 p-4 xl:col-span-2"
//               >
//                 <h2 className="text-center text-2xl font-semibold text-slate-900">
//                   Historical Tracing
//                 </h2>
//                 <Metrics
//                   defaultView={defaultView}
//                   clickedPod={clickedPod}
//                   cpuUsageHistorical={allData.cpuUsageHistorical}
//                   memoryUsageHistorical={allData.memoryUsageHistorical}
//                 />
//               </div>
    
//               {/* Request vs. Limit */}
//               <div
//                 id="request-vs-limit"
//                 className="relative flex-auto rounded-3xl bg-slate-100 p-4 xl:col-span-2"
//               >
//                 <h2 className="text-center text-2xl font-semibold text-slate-900">
//                   Request vs. Limit
//                 </h2>
//                 <RequestLimit
//                   defaultView={defaultView}
//                   clickedPod={clickedPod}
//                   selectedMetric={selectedMetric}
//                   requestLimits={allData.requestLimits}
//                 />
//               </div>
    
//               {/* Latency */}
//               <div
//                 id="latency"
//                 className="rounded-3xl bg-slate-100 p-4 xl:col-span-2"
//               >
//                 <h2 className="text-center text-2xl font-semibold text-slate-900">
//                   Request Latency
//                 </h2>
//                 <Latency
//                   defaultView={defaultView}
//                   clickedPod={clickedPod}
//                   cpuUsageHistorical={allData.cpuUsageHistorical}
//                   latencyAppRequestHistorical={
//                     allData.latencyAppRequestHistorical
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//           {/* Bottom row of buttons */}
//           <div className="relative mx-6">
//             {/* AI Chatbot */}
//             {aiVisibility && (
//               <div className="absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl">
//                 <Chatbot
//                   allData={allData}
//                   fetchData={(method, endpoint, body) =>
//                     fetch(`${backendUrl}/${endpoint}`, {
//                       method,
//                       headers: { "Content-Type": "application/json" },
//                       body: JSON.stringify(body),
//                     }).then((res) => res.json())
//                   }
//                   username={username}
//                 />
//               </div>
//             )}
//             {/* Reset and Ask AI buttons */}
//             <div className="flex justify-between pb-5">
//               <button
//                 onClick={resetView}
//                 className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90"
//               >
//                 Reset to Default
//               </button>
//               <button
//                 onClick={() => setAiVisibility(!aiVisibility)}
//                 className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90"
//               >
//                 Ask AI
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   };  
    
// MainContainer.propTypes = {
//   username: PropTypes.string.isRequired,
//   backendUrl: PropTypes.string.isRequired,

//   resetView: PropTypes.func.isRequired,
// };

// export default MainContainer;