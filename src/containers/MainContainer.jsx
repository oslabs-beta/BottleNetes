import PropTypes from "prop-types";
import { useState } from "react";

import MenuContainer from "./MenuContainer";
import Overview from "../components/Overview"
import ErrorRate from "../components/ErrorRate"
import Metrics from "../components/Metrics"
import PodGrid from "../components/PodGrid"
import RequestLimit from "../components/RequestLimit"


const MainContainer = ({ username }) => {
  const url = 'http:/localhost:3000';
  
  // State for when the menu button is clicked
  const [menu, setMenu] = useState(false);
  // 
  const [metric, setMetric] = useState('latency');
  // Determines if the graphs display node data or pod specific data
  const [defaultView, setDefaultView] = useState(true);
  // Fleet wide data that is collected live
  const [overviewData, setOverviewData] = useState({});
  // Pod level data to be displayed, updates when user clicks into pod
  const [podData, setPodData] = useState({})


  useEffect(() => {
    const fetchPodData = async () => {
      try {
        const response = await fetch(/*url*/);
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
        alert('Could not fetch data from the server')
      }
    }
    setInterval(fetchPodData, 30000);
  }, [])
  

  return (
    <div>
      <button onClick={() => setMenu(true)}>Menu</button>
      {!menu && <MenuContainer />}
      <h1>{`Welcome, ${username}`}</h1>
      <div /*grid*/>
        <Overview />
        <RequestLimit />
        <ErrorRate />
        <Metrics />
        <PodGrid />
      </div>
      <button>Reset to default</button>
      <button>Ask AI</button>
   ;</div>
  );
};

MainContainer.propTypes = {
  username: PropTypes.string,
};

export default MainContainer;
