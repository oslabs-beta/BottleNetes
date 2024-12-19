import { useState } from "react";
import SigninContainer from "./containers/SigninContainer";
import MainContainer from "./containers/MainContainer";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

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
