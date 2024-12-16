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

function App() {
  const { isSignedIn, loading, signIn, signOut, setLoading } = useStore();

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
        if (data.signedIn) signIn();
        else signOut();
        setLoading(false);
      } catch (error) {
        console.error(error);
        signOut();
        setLoading(false);
      }
    };
    checkSigninStatus();
  }, [signIn, signOut, setLoading]);

  if (loading) return <div>Loading...</div>

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
            path="/dashboard"
            element={isSignedIn ? <MainContainer /> : <Navigate to="/" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
