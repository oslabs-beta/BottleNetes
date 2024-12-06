import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import Pod from "./Pod";

const PodGrid = (props) => {
  const { setClickedPod, metric, setMetric } =
    props;
  // Placeholder for actual url
  const url = "http://localhost:3000";
  // State to hold all pod data
  const [podData, setPodData] = useState([]);

  // Function to fetch pod data from server
  const fetchInfo = async (type, time, level) => {
    const body = {
      type,
      time,
      aggregation: "avg",
      level,
    };
    try {
      const response = await fetch(url + "query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        const mappedData = data.map((el) => [el.metric, el.value]);
        setPodData(mappedData);
        /*
          Data Structure:
          el: {
            metric: { pod }
            value: [num (max?), str (value?)]
          }
          */
      } else {
        const data = await response.json();
        console.error(data);
        alert("😭 Failed to fetch data. Response is not OK!");
      }
    } catch (error) {
      console.error(error);
      alert("😿 Error while fetching data from the server");
    }
  };

  // Will fetch data from the server, rendering default metrics, refresh every 30s and re-render everytime metric changes 
  useEffect(() => {
    fetchInfo(metric, "1h", "pod");
    const intervalID = setInterval(() => fetchInfo(metric, "1h", "pod"), 30000);
    return () => {
      clearInterval(intervalID);
    };
  }, [metric]);


  // Function to update metric
  const handleMetricChange = (newMetric) => {
    setMetric(newMetric);
  };

  return (
    <div id="pod-grid">
      {/* Render the grid of pods as a list */}
      <ul id="pod-list">
        {podData.map((pod, index) => (
          <li key={index}>
            <Pod
              metric={metric}
              pod={pod}
              type="button"
              setClickedPod={setClickedPod}
              fetchInfo={fetchInfo}
            />
          </li>
        ))}
      </ul>
      {/* Render the change metric buttons */}
      <div>
        <button onClick={() => handleMetricChange("cpu")}>
          {"CPU Usage (%)"}{" "}
        </button>
        <button onClick={() => handleMetricChange("ram")}>
          {"RAM Usage (%)"}
        </button>
        <button onClick={() => handleMetricChange("disk")}>
          {"Disk Usage (%)"}
        </button>
        <button onClick={() => handleMetricChange("errorRate")}>
          {"Error Rate (%)"}
        </button>
        <button onClick={() => handleMetricChange("latency")}>
          {"Latency(ms)"}
        </button>
      </div>
    </div>
  );
};

PodGrid.propTypes = {
  setClickedPod: PropTypes.func,
  metric: PropTypes.string,
  setMetric: PropTypes.func,
};

export default PodGrid;
