import PropTypes from "prop-types";
import { useState, useEffect } from "react";

import MenuContainer from "./MenuContainer";
import Overview from "../components/Overview";
import ErrorRate from "../components/ErrorRate";
import Metrics from "../components/Metrics";
import PodGrid from "../components/PodGrid";
import RequestLimit from "../components/RequestLimit";

// Pod level data to be displayed, updates when user clicks into pod
// const [podData, setPodData] = useState({});

const MainContainer = ({ username }) => {
  const url = "http:/localhost:3000/";

  // State for when the menu button is clicked
  const [menu, setMenu] = useState(false);

  // Default metric set to latency
  const [metric, setMetric] = useState("latency");

  // Determines if the graphs display node data or pod specific data
  const [defaultView, setDefaultView] = useState(true);

  // Overview data to be displayed at the very top
  const [overviewData, setOverviewData] = useState({});

  // Which pod has been clicked
  const [clickedPod, setClickedPod] = useState("");

  //helper function
  const fetchData = async (method, endpoint, body) => {
    try {
      const response = await fetch(url + endpoint, {
        method: method,
        header: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const data = await response.json();
        setOverviewData(data);
      } else {
        const data = await response.json();
        console.error(data);
        alert(response.statusText);
      }
    } catch (error) {
      console.error(error);
      alert("😿 Could not fetch data from the server. TryingToFetch default data");
    }
  };
  //Used to populate overview component
  useEffect(() => {
    const body = {
      type: "cpu",
      time: "1d",
      aggregation: "avg",
      level: "node",
    };
    fetchData("POST", "query", body);
    const intervalID = setInterval(fetchData, 30000);
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
        <Overview overviewData={overviewData} />
        <RequestLimit defaultView={defaultView} clickedPod={clickedPod} />
        <ErrorRate defaultView={defaultView} clickedPod={clickedPod} />
        <Metrics defaultView={defaultView} clickedPod={clickedPod} />
        <PodGrid
          defaultView={defaultView}
          setDefaultView={setDefaultView}
          setClickedPod={setClickedPod}
          metric={metric}
          setMetric={setMetric}
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
