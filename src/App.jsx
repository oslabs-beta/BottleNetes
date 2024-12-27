/* eslint-disable no-unused-vars */
/**
 * This component contains the security logics
 */

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SigninContainer from "./containers/SigninContainer";
import MainContainer from "./containers/MainContainer";
import useStore from "./store.jsx";
import CallbackHandler from './hooks/CallbackHandler.jsx';

const App = () => {
  const {
    isSignedIn,
    loading,
    username,
    signIn,
    signOut,
    setLoading,
    setUsername,
  } = useStore();

  const [backendUrl, setBackendUrl] = useState("http://localhost:3000/");

  useEffect(() => {
    const checkSigninStatus = async () => {
      console.log(`Sending request to '${backendUrl}signin/checkSignin'...`);

      try {
        const response = await fetch(backendUrl + "signin/checkSignin", {
          credentials: "include",
        });
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
  }, [signIn, signOut, setLoading, setUsername, backendUrl]);

  if (loading) return <div>Loading...</div>;

  return (
    <div id="app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isSignedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <SigninContainer backendUrl={backendUrl} />
              )
            }
          />
          <Route
            path="/oauth/callback"
            element={
              isSignedIn ? (
                <Navigate to="/dashboard" />
              ) : (
                <CallbackHandler backendUrl={backendUrl} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <MainContainer username={username} backendUrl={backendUrl} />
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
