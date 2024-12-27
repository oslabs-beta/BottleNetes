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
    // Setting up a controller to stop the useEffect from running when closing the application
    const controller = new AbortController();
    const signal = controller.signal;

    const checkSigninStatus = async () => {
      console.log(`Sending request to '${backendUrl}signin/checkSignin'...`);

      try {
        /**
         * Fetch request runs when landing on the homepage.
         * It checks if the user is already signed in by checking the cookie
         * Credentials are included to send the cookie back to the backend
         * Cookie format:
         * { "jwt": "jwt_encoded_string" }
         **/
        const response = await fetch(backendUrl + "signin/checkSignin", {
          credentials: "include",
          signal, // Adding signal to the fetch request
        });

        if (!response.ok) {
          console.error(
            `Server responded with a ${response.status} code: ${response.statusText}`,
          );
        }
        const data = await response.json();
        console.log(data);

        /**
         * If they are already signed in
         * isSignedIn is set to true, which in turn will trigger the redirect to '/dashboard'
         */
        if (data.signedIn) {
          setUsername(data.username);
          signIn();
        }
        // Otherwise, make sure they are signed out
        else signOut();

        setLoading(false);
      } catch (error) {
        // added this to bypass the AbortError in browser console (may not be the best solution)
        if (error.name != "AbortError") {
          console.error(error);
          signOut();
        }
      } finally {
        setLoading(false);
      }
    };

    checkSigninStatus();

    // useEffect clean up function. Abort the fetch request when shutting down the application
    return () => controller.abort();
  }, [signIn, signOut, setLoading, setUsername, backendUrl]);

  if (loading) return <div>Loading...</div>;

  // Router for Client-side Rendering (CSR)
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

  // Return the RouterProvider component to use the router above
  return (
    <div id="app">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
