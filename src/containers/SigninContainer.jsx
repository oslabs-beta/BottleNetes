/**
 * This component renders the Sign In Page
 */

import { useState } from "react";
import PropTypes from "prop-types";
import { Hexagon } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

import useStore from "../store.jsx";

const SigninContainer = ({ backendUrl }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const signIn = useStore((state) => state.signIn);
  const signOut = useStore((state) => state.signOut);

  const credential = { username, password };

  const handleLogIn = async (e) => {
    console.log(`🔄 Sending request to ${backendUrl}signin`);
    e.preventDefault();

    const response = await fetch(backendUrl + "signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credential),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setUsername(data.username);
      signIn();
      navigate("/dashboard");
    } else {
      signOut();
      alert("Unable to fetch data");
    }
  };

  const initiateOAuth = (provider) => {
    window.location.href = backendUrl + provider;
  };

  return (
    <div
      id="login-container"
      className="flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-bl from-slate-950 from-10% via-slate-800 via-70% to-cyan-950 to-90% text-center align-middle font-mono"
    >
      <h1 className="animate-text-color-animation font-sans text-7xl font-black transition duration-300 hover:scale-105">
        <a
          href="https://github.com/oslabs-beta/BottleNetes"
          title="Visit our GitHub"
        >
          B o t t l e N e t e s
        </a>
      </h1>
      <Hexagon
        className="-mb-64 size-64 animate-slow-spin"
        color="rgb(14, 116, 144)"
        strokeWidth={0.5}
      />
      <Hexagon
        className="-mb-64 size-64 animate-slow-spin opacity-35"
        color="rgb(8 145 178)"
        strokeWidth={1}
      />
      <img src="src/assets/logo.png" className="mt-2 size-60" />
      <div
        id="loginDisplay"
        className="my-10 w-1/5 content-center rounded-2xl border-2 border-slate-800 bg-slate-950/10 p-5 text-center align-middle shadow-2xl shadow-slate-950"
      >
        <h2 className="pb-5 text-3xl text-slate-300">Log In</h2>
        <form className="mx-5 flex flex-col gap-y-2">
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-md bg-slate-800 p-1 px-10 text-center text-slate-300 focus:bg-slate-700"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md bg-slate-800 p-1 px-10 text-center text-slate-300 focus:bg-slate-700"
          />
        </form>
        <br />
        <div id="button-container" className="flex justify-around">
          <button
            className="rounded-lg border-2 border-slate-600 bg-slate-700 px-5 py-2 text-slate-300 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-600 hover:text-slate-200 active:border-slate-700 active:bg-slate-800 active:text-slate-400"
            type="button"
            id="login-button"
            onClick={handleLogIn}
          >
            Log In
          </button>
          <Link to={"/signup"}>
            <button
              className="rounded-lg border-2 border-slate-600 bg-slate-700 px-5 py-2 text-slate-300 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-600 hover:text-slate-200 active:border-slate-700 active:bg-slate-800 active:text-slate-400"
              type="button"
              id="signup-button"
            >
              Sign Up
            </button>
          </Link>
        </div>
        <p className="py-5 text-3xl text-slate-300">
          <strong>OR</strong>
        </p>
        <div
          id="oauth-button"
          className="flex flex-col items-center justify-center gap-2"
        >
          <button
            className="flex items-center gap-5 rounded-lg border-2 border-slate-600 bg-slate-700 px-5 py-2 text-slate-300 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-600 hover:text-slate-200 active:border-slate-700 active:bg-slate-800 active:text-slate-400"
            type="button"
            id="github"
            onClick={() => initiateOAuth("oauth/github")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              className="fill-current text-2xl"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8" />
            </svg>
            <span>Sign In with GitHub</span>
          </button>
          <button
            className="flex items-center gap-5 rounded-lg border-2 border-slate-600 bg-slate-700 px-5 py-2 text-slate-300 transition-colors duration-200 hover:border-slate-500 hover:bg-slate-600 hover:text-slate-200 active:border-slate-700 active:bg-slate-800 active:text-slate-400"
            type="button"
            id="google"
            onClick={() => initiateOAuth("oauth/google")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              className="fill-current text-2xl"
              viewBox="0 0 16 16"
            >
              <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
            </svg>
            Sign In with Google
          </button>
        </div>
        <br />
        <button
          className="text-slate-300 hover:text-slate-200 active:text-slate-400"
          type="button"
          id="retrieve-button"
        >
          Forgot your Password?
        </button>
      </div>
    </div>
  );
};

SigninContainer.propTypes = {
  backendUrl: PropTypes.string,
  username: PropTypes.string,
  setUsername: PropTypes.func,
  setLoggedIn: PropTypes.func,
};

export default SigninContainer;
