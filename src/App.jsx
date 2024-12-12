import { useState, useEffect } from "react";
import SigninContainer from "./containers/SigninContainer";
import MainContainer from "./containers/MainContainer";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  // If you need to set a default username for testing, use useEffect
  useEffect(() => {
    setUsername("zoe");
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div id="app">
      {!loggedIn ? (
        <SigninContainer
          username={username}
          setUsername={setUsername}
          setLoggedIn={setLoggedIn}
        />
      ) : (
        <MainContainer username={username} />
      )}
    </div>
  );
}

export default App;
