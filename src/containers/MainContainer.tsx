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

import { useRef, useEffect } from "react";

// Container Folder
import MenuContainer from "./MenuContainer";

// Component Folder
import Overview from "../components/Overview";
import Latency from "../components/LatencyComponents/Latency";
import Metrics from "../components/HistoricalMetricsComponents/Metrics";
import RequestLimit from "../components/RequestLimitComponents/RequestLimit";
import Chatbot from "../components/Chatbot";
import DarkMode from "../components/DarkMode";

// HeatMap Component Folder
import PodGrid from "../components/HeatMapComponents/PodGrid";
import PodNameDisplay from "../components/HeatMapComponents/PodNameDisplay";

// Hooks Folder
import useFetchData from "../hooks/useFetchData";

// Stores Folder
import mainStore from "../stores/mainStore";
import userStore from "../stores/userStore";

const MainContainer = () => {
  const {
    // Determines if the graphs display node data or pod specific data
    setDefaultView,
    // state hooks for clicked pod and selected metric in PodGrid (will also be passed down to other components)
    clickedPod,
    setClickedPod,
    // State hook for set the menu sidebar's visibility
    isMenuOpen,
    setIsMenuOpen,
    // State hook for AI chatbot visibility
    aiVisibility,
    setAiVisibility,
  } = mainStore();

  const username = userStore((state) => state.username);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const { isFetchingData, allData } = useFetchData();

  // ensure the clickedPod state stays valid after each refresh
  useEffect(() => {
    if (
      !Array.isArray(allData.podsStatuses) &&
      allData.podsStatuses?.allPodsStatus?.length > 0 &&
      clickedPod.podName
    ) {
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
  }, [allData.podsStatuses, clickedPod, setClickedPod, setDefaultView]);

  // Handle the click outside of the menu to close the menu
  useEffect(() => {
    // Close the menu when clicking outside of the menu
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current?.contains(event.target as Node)) return; // if the button is clicked, bypass

      // Close the menu bar if clicking outside menu and menu is open
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsMenuOpen]);

  // The loading container is now handled in the Overview component
  // if (isFetchingData) return <LoadingContainer />;

  return (
    <div id="main-container">
      <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 bg-gradient-to-r from-slate-950 to-slate-900 py-4 dark:border-slate-600 dark:bg-gradient-to-r dark:from-slate-950 dark:to-slate-900 sm:flex-row">
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
              className={`fixed left-0 top-20 h-screen w-80 transform overflow-y-auto bg-gradient-to-r from-slate-900 to-[#101b38] p-4 shadow-lg transition-transform duration-300 ease-in-out ${
                isMenuOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            >
              <MenuContainer />
            </div>
          </div>
          {/* Title */}
          <h1 className="bg-gradient-to-bl from-blue-500 to-blue-600 bg-clip-text px-5 font-sans text-5xl font-bold text-transparent transition duration-300 hover:scale-105">
            BottleNetes
          </h1>
        </div>
        {/* Ask AI Button, Dark Mode,and Welcome text */}
        <div className="flex items-center space-x-[50px]">
          <div className="flex justify-between">
            <button
              onClick={() => setAiVisibility(!aiVisibility)}
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90"
            >
              Ask AI
            </button>
          </div>
          <DarkMode />
          <h1 className="mr-5 px-5 text-2xl font-semibold text-slate-300">{`Welcome, ${username}`}</h1>
        </div>
      </header>
      <div className="dark:bg-custom-gradient-dark bg-custom-gradient">
        <div className="border-b-2 border-slate-300 p-6 dark:border-slate-600">
          {/* Overview Display */}
          <Overview isFetchingData={isFetchingData} />
        </div>

        {/* Pod Name Display */}
        <div className="border-b-2 border-slate-300 dark:border-slate-600">
          <PodNameDisplay />
        </div>

        {/* Main Container */}
        <div
          id="graph-container"
          className="mt-2 flex min-h-screen flex-col gap-4 p-6 text-slate-100"
        >
          <div className="lg-xl:grid-cols-2 grid grid-cols-1 gap-10 xl:grid-cols-4">
            {/* Pod Grid */}
            <div
              id="pod-grid"
              className="flex max-h-[100%] flex-col rounded-3xl bg-slate-100 p-4 dark:border-2 dark:border-transparent dark:bg-slate-900 dark:shadow-custom-lg xl:col-span-2"
            >
              <h2 className="mb-[5px] text-center text-2xl font-bold text-slate-900 dark:text-slate-300">
                Heat Map
              </h2>
              <PodGrid />
            </div>

            {/* Historical Tracing */}
            <div
              id="historical-tracing"
              className="max-h-[100%] rounded-3xl bg-slate-100 p-4 dark:bg-slate-900 dark:shadow-custom-lg xl:col-span-2"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-300">
                Historical Tracing
              </h2>
              <Metrics />
            </div>

            {/* Request vs. Limit */}
            <div
              id="request-vs-limit"
              className="h-[500px] w-full overflow-y-auto rounded-3xl bg-slate-100 p-4 dark:bg-slate-900 dark:shadow-custom-lg xl:col-span-2"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-300">
                Request vs. Limit
              </h2>
              <RequestLimit />
            </div>

            {/* Latency */}
            <div
              id="latency"
              className="rounded-3xl bg-slate-100 p-4 dark:bg-slate-900 dark:shadow-custom-lg xl:col-span-2"
            >
              <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-300">
                Request Latency
              </h2>
              <Latency />
            </div>
          </div>
        </div>
        {/* Bottom row of buttons */}
        <div className="relative mx-6">
          {/* AI Chatbot */}
<<<<<<< HEAD:src/containers/MainContainer.jsx
            <div className={`absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl transition duration-100 ${aiVisibility ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
              <Chatbot
                allData={allData}
                username={username}
                className="text-gradient font-poppins text-2xl font-bold shadow-lg"
                logoStyle={{
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  backgroundImage:
                    "linear-gradient(to right, #1e90ff, #87ceeb)",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              />
            </div>
=======
          <div
            className={`absolute bottom-[100%] right-0 mb-3 w-96 rounded-2xl transition-opacity duration-300 ${aiVisibility ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Chatbot setAiVisibility={setAiVisibility} />
          </div>
          {/* Reset and Ask AI buttons */}
          <div className="flex justify-between pb-5">
            <button
              onClick={() => setAiVisibility(!aiVisibility)}
              className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-lg font-semibold text-slate-200 hover:brightness-90"
            >
              Ask AI
            </button>
          </div>
>>>>>>> dev:src/containers/MainContainer.tsx
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
