/**
 * This component contains the security logics
 */

import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate, createBrowserRouter, RouterProvider
} from "react-router-dom";

import SigninContainer from "./containers/SigninContainer";
import MainContainer from "./containers/MainContainer";
import useStore from "./store.jsx";
import CallbackHandler from "./hooks/CallbackHandler.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

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

  const router = createBrowserRouter([
    {
      path: '/',
      element: isSignedIn ? <Navigate to={'/dashboard'} /> : <SigninContainer />
    },
    {
      path: '/'
    }
  ])

  const [backendUrl] = useState("http://localhost:3000/");

  // This hook fires whenever you go to the home page (Sign In Page)
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const checkSigninStatus = async () => {
      console.log(`Sending request to '${backendUrl}signin/checkSignin'...`);

      try {
        const response = await fetch(backendUrl + "signin/checkSignin", {
          credentials: "include",
          signal,
        });

        if (!response.ok) {
          console.error(
            `Server responded with a ${response.status} code: ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log(data);

        if (data.signedIn) {
          setUsername(data.username);
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

    return () => controller.abort();
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
            path="/oauth/github/callback"
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
              <ProtectedRoute isSignedIn={isSignedIn}>
                <MainContainer username={username} backendUrl={backendUrl} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
