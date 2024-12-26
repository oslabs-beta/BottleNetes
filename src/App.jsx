/**
 * This component contains the security logics
 */

import { useEffect, useState } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import SigninContainer from "./containers/SigninContainer";
import MainContainer from "./containers/MainContainer";
import SignupContainer from "./containers/SignupContainer";
import useStore from "./store.jsx";

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

  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: isSignedIn ? (
        <MainContainer username={username} backendUrl={backendUrl} />
      ) : (
        <Navigate to={"/"} />
      ),
    },
    {
      path: "/signup",
      element: <SignupContainer />,
    },
    {
      path: "/",
      element: isSignedIn ? (
        <Navigate to={"/dashboard"} />
      ) : (
        <SigninContainer backendUrl={backendUrl} />
      ),
    },
  ]);

  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
