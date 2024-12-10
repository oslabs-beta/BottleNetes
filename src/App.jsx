import { useState } from "react";
import LogInContainer from "./containers/LogInContainer";
import MainContainer from "./containers/MainContainer";

// TESTING OUT*********************
import Latency from "./components/Latency";


function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // *******************************
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

  // Data of selected pod
  const [podData, setPodData] = useState([]);
  // *******************************

  return (
    <div id="app">
      {/* {!loggedIn ? (
        <LogInContainer
          username={username}
          setUsername={setUsername}
          setLoggedIn={setLoggedIn}
        />
      ) : (
        <MainContainer username={username} />
      )} */}
      <Latency
        defaultView={defaultView}
        clickedPod={clickedPod}
        podData={podData}
        setPodData={setPodData}
      />
    </div>
  );
}

export default App;
