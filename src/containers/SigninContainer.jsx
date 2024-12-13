import { useState } from "react";
import PropTypes from "prop-types";
import { Hexagon } from "lucide-react";

const LogInContainer = (props) => {
  const url = "http://localhost:3000/";

  const { username, setUsername, setLoggedIn } = props;
  const [password, setPassword] = useState("");
  const credential = { username, password };

  const handleLogIn = async (e) => {
    console.log(`🔄 Sending request to ${url}signin`);
    e.preventDefault();

    const response = await fetch(url + "signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(credential),
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      setLoggedIn(true);
      setUsername(data.username);
    }
    else alert("Unable to fetch data");
  };

  const handleRedirect = async (endpoint) => {
    console.log(`🔄 Sending request to ${url + endpoint}`);

    try {
      const response = await fetch(url + endpoint);
      const data = await response.json();
      console.log(data);

      if (!response.ok) alert("Unable to redirect to requested page");
    } catch (error) {
      console.error(`😳 Redirect failed: ${error}`);
      // alert("Please try again later...");
    }
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
        className="my-10 size-1/5 content-center rounded-2xl border-2 border-slate-950 bg-slate-950 text-center align-middle"
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
            className="rounded-md bg-slate-900 p-1 px-10 text-center text-slate-300 focus:bg-slate-800"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md bg-slate-900 p-1 px-10 text-center text-slate-300 focus:bg-slate-800"
          />
        </form>
        <br />
        <div id="button-container" className="flex justify-around">
          <button
            className="hover:border-3 active:border-3 rounded-lg border-2 border-slate-600 bg-slate-700 px-5 py-2 text-slate-300 hover:border-slate-500 hover:bg-slate-600 hover:text-slate-200 active:border-slate-700 active:bg-slate-800 active:text-slate-400"
            type="button"
            id="login-button"
            onClick={handleLogIn}
          >
            Log In
          </button>
          <a href="/signup">
            <button
              className="hover:border-3 active:border-3 rounded-lg border-2 border-slate-600 bg-slate-700 px-5 py-2 text-slate-300 hover:border-slate-500 hover:bg-slate-600 hover:text-slate-200 active:border-slate-700 active:bg-slate-800 active:text-slate-400"
              type="button"
              id="signup-button"
              onClick={() => handleRedirect("signup")}
            >
              Sign Up
            </button>
          </a>
        </div>
        <br />
        <button
          className="text-slate-300 hover:text-slate-200 active:text-slate-400"
          type="button"
          id="retrieve-button"
          onClick={() => handleRedirect("forgotpassword")}
        >
          Forgot your Password?
        </button>
      </div>
    </div>
  );
};

LogInContainer.propTypes = {
  username: PropTypes.string,
  setUsername: PropTypes.func,
  setLoggedIn: PropTypes.func,
};

export default LogInContainer;
