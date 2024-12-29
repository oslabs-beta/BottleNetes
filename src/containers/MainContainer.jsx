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

const MainContainer = ({ 
  username, 
  backendUrl, 
  allData, 
  resetView, 
}) => {
  // Manages whether data displays node-level or pod-specific details.
  const [defaultView, setDefaultView] = useState(true);

  // Time window for pod grid queries (default to "1m").
  const [queryTimeWindow, setQueryTimeWindow] = useState("1m");

  // Stores information about the selected pod.
  const [clickedPod, setClickedPod] = useState({
    podName: "",
    namespace: "",
    containers: [],
    deployment: "",
  });

  // State to manage AI Chatbot visibility.
  const [aiVisibility, setAiVisibility] = useState(false);

  // Stores the currently selected metric for display (default to "CPU").
  const [selectedMetric, setSelectedMetric] = useState("cpu");

  // Tracks pod restart counts.
  const [podRestartCount, setPodRestartCount] = useState(0);

  // State variables for refresh control in the MenuContainer.
  const [manualRefreshCount, setManualRefreshCount] = useState(0);
  const [refreshFrequency, setRefreshFrequency] = useState(30000);
  const [showRefreshPopup, setShowRefreshPopup] = useState(false);
  const [refreshInput, setRefreshInput] = useState("");

  // Sidebar menu visibility and references for event listeners.
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  // Fetch data using a custom hook (only extract needed values).
  const { allData: fetchedData } = useFetchData({
    backendUrl,
    refreshFrequency,
    queryTimeWindow,
    podRestartCount,
    manualRefreshCount,
  });

  // Automatically close the menu when clicking outside.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (buttonRef.current?.contains(event.target)) return; // Ignore clicks on the menu button.
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false); // Close menu if clicking outside.
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
      <div>
        <header className="header sticky top-0 z-50 flex flex-col items-center justify-between gap-4 border-b-2 bg-gradient-to-r from-[#0f172a] to-[#1e40af] py-4 sm:flex-row">
          {/* Remaining JSX code */}
        </header>
      </div>
  );
};

MainContainer.propTypes = {
  username: PropTypes.string.isRequired,
  backendUrl: PropTypes.string.isRequired,
  allData: PropTypes.object.isRequired,
  resetView: PropTypes.func.isRequired,
};

export default MainContainer;