import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import useStore from "./store.jsx";
import SigninContainer from "./containers/SigninContainer";
import MainContainer from "./containers/MainContainer";
import CallbackHandler from "./CallbackHandler.jsx";

function App() {
  const {
    isSignedIn,
    loading,
    username,
    signIn,
    signOut,
    setLoading,
    setUsername,
  } = useStore();

  useEffect(() => {
    const checkSigninStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/signin/checkSignin",
          {
            credentials: "include",
          },
        );
        const data = await response.json();
        console.log(data);
        if (data.signedIn) {
          setUsername(data.username.username);
          signIn();
        } else signOut();
        setLoading(false);
      } catch (error) {
        console.error(error);
        signOut();
        setLoading(false);
      }
    };
    checkSigninStatus();
  }, [signIn, signOut, setLoading, setUsername]);

  if (loading) return <div>Loading...</div>;

  return (
    <div id="app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isSignedIn ? <Navigate to="/dashboard" /> : <SigninContainer />
            }
          />
          <Route
            path="/oauth/callback"
            element={
              isSignedIn ? <Navigate to="/dashboard" /> : <CallbackHandler />
            }
          />
          <Route
            path="/dashboard"
            element={<MainContainer username={username} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
