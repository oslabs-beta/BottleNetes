/**
 * This component contains the security logics
 */

import { useEffect } from "react";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import SigninContainer from "./containers/SigninContainer";
import MainContainer from "./containers/MainContainer";
import SignupContainer from "./containers/SignupContainer";
import LoadingContainer from "./containers/LoadingContainer";

import userStore from "./stores/userStore";
import dataStore from "./stores/dataStore";

type Data = {
  signedIn: boolean;
  username: string;
};

const App = () => {
  const { signedIn, setSignedIn, loading, setLoading, setUsername } =
    userStore();

  const backendUrl = dataStore((state) => state.backendUrl);
  // This hook fires whenever you go to the home page (Sign In Page)
  useEffect(() => {
    // Setting up a controller to stop the useEffect from running when closing the application
    const controller = new AbortController();
    const signal = controller.signal;

    const checkSigninStatus = async () => {
      console.log(
        `Sending request to '${backendUrl}user/signin/checkSignin'...`,
      );

      try {
        /**
         * Fetch request runs when landing on the homepage.
         * It checks if the user is already signed in by checking the cookie
         * Credentials are included to send the cookie back to the backend
         * Cookie format:
         * { "jwt": "jwt_encoded_string" }
         **/
        const response = await fetch(backendUrl + "user/signin/checkSignin", {
          credentials: "include",
          signal, // Adding signal to the fetch request
        });

        if (!response.ok) {
          console.error(
            `Server responded with a ${response.status} code: ${response.statusText}`,
          );
        }
        const data: Data = await response.json();
        console.log(data);

        /**
         * If they are already signed in
         * isSignedIn is set to true, which in turn will trigger the redirect to '/dashboard'
         */
        if (data.signedIn) {
          setUsername(data.username);
          setSignedIn(true);
        }
        // Otherwise, make sure they are signed out
        else setSignedIn(false);

        setLoading(false);
      } catch (error) {
        // added this to bypass the AbortError in browser console (may not be the best solution)
        if (error instanceof Error && error.name !== "AbortError") {
          console.error(error);
          setSignedIn(false);
        }
      } finally {
        setLoading(false);
      }
    };

    checkSigninStatus();

    // useEffect clean up function. Abort the fetch request when shutting down the application
    return () => controller.abort();
  }, [setSignedIn, setLoading, setUsername, backendUrl]);

  if (loading) return <LoadingContainer />;

  // Router for Client-side Rendering (CSR)
  const router = createBrowserRouter([
    {
      path: "/dashboard",
      element: signedIn ? <MainContainer /> : <Navigate to={"/"} />,
    },
    {
      path: "/user/signup",
      element: <SignupContainer />,
    },
    {
      path: "/",
      element: signedIn ? <Navigate to={"/dashboard"} /> : <SigninContainer />,
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
