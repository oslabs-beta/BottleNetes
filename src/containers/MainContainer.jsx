import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import MenuContainer from "./MenuContainer";
import Overview from "../components/Overview";
import Latency from "../components/Latency";
import Metrics from "../components/Metrics";
import PodGrid from "../components/PodGrid";
import RequestLimit from "../components/RequestLimit";

// Pod level data to be displayed, updates when user clicks into pod
// const [podData, setPodData] = useState({});

const MainContainer = ({ username }) => {
  const url = "http://localhost:3000/";

  // State for when the menu button is clicked
  const [menu, setMenu] = useState(false);

  // Default metric set to latency
  // const [metric, setMetric] = useState("latency");

  // Determines if the graphs display node data or pod specific data
  const [defaultView, setDefaultView] = useState(true);

  // Overview data to be displayed at the very top
  // const [overviewData, setOverviewData] = useState({});

  // Which pod has been clicked
  const [clickedPod, setClickedPod] = useState("");

  // Data of selected pod
  const [podData, setPodData] = useState([]);

  // Data of all pods
  const [allData, setAllData] = useState({});

  const [isLoading, setIsLoading] = useState(true);

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
        "type": "cpu",
        "time": "1m",
        "level": "pod"
      };

      const bodyResourceUsageOnevalueMemory = {
        "type": "memory",
        "time": "1m",
        "level": "pod"
      };

      const bodyResourceUsageHistoricalCPU = {
        "type": "cpu",
        "timeEnd": Math.floor(Date.now() / 1000).toString(),
        "timeStart": (Math.floor(Date.now() / 1000) - 86400).toString(),
        "timeStep": "3600",
        "level": "pod"
      };

      const bodyResourceUsageHistoricalMemory = {
        "type": "memory",
        "timeEnd": Math.floor(Date.now() / 1000).toString(),
        "timeStart": (Math.floor(Date.now() / 1000) - 86400).toString(),
        "timeStep": "3600",
        "level": "pod"
      };

      const bodyLatencyAppRequestOneValue = {
        "time": "1m",
        "level": "pod",
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
        ]);

        setAllData({
          podsStatuses: status || null,
          requestLimits: requestLimits || null,
          allNodes: fakeNodeData,
          cpuUsageOneValue: cpuUsageOneValue || null,
          memoryUsageOneValue: memoryUsageOneValue || null,
          cpuUsageHistorical: cpuUsageHistorical || null,
          memoryUsageHistorical: memoryUsageHistorical || null,
          latencyAppRequestOneValue: latencyAppRequestOneValue || null,
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

  return (
    <div id="main-container">
      <button onClick={() => setMenu(true)}>Menu</button>
      {!menu && <MenuContainer />}
      <h1>{`Welcome, ${username}`}</h1>
      <div /*grid*/>
        <Overview
          podsStatuses={allData.podsStatuses}
          allNodes={allData.allNodes}
          isLoading={isLoading}
        />
        <RequestLimit
          defaultView={defaultView}
          clickedPod={clickedPod}
          requestLimits={allData.requestLimits}
        />
        <Latency
          defaultView={defaultView}
          clickedPod={clickedPod}
          latencyAppRequestOneValue={allData.latencyAppRequestOneValue}
        />
        <Metrics
          defaultView={defaultView}
          clickedPod={clickedPod}
          cpuUsageHistorical={allData.cpuUsageHistorical}
          memoryUsageHistorical={allData.memoryUsageHistorical}
        />
        <PodGrid
          defaultView={defaultView}
          setDefaultView={setDefaultView}
          setClickedPod={setClickedPod}
          podStatuses={allData.podStatuses}
          requestLimits={allData.requestLimits}
          cpuUsageOneValue={allData.cpuUsageOneValue}
          memoryUsageOneValue={allData.memoryUsageOneValue}
          latencyAppRequestOneValue={allData.latencyAppRequestOneValue}
        />
      </div>
      <button onClick={() => setDefaultView(true)}>Reset to default</button>
      <button>Ask AI</button>
    </div>
  );
};

MainContainer.propTypes = {
  username: PropTypes.string,
};

export default MainContainer;
