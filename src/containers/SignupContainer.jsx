/**
 * This component renders the Sign Up Page
 */
import PropTypes from "prop-types";
import { Hexagon } from "lucide-react";
import { Link } from "react-router-dom";

const SignupContainer = ({
  username,
  setUsername,
  password,
  setPassword,
  email,
  setEmail,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  backendUrl,
}) => {
  const handleSignup = async () => {
    const newUserCredential = { username, password, email, firstName, lastName };
    console.log(`🔄 Sending request to ${backendUrl}user/signup`);

    try {
      const response = await fetch(backendUrl + "user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUserCredential),
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        console.log("😛 New user successfully created!");
        alert("Succesfully created a new account.");
      } else alert("Something is wrong... Please try again later.");
    } catch (error) {
      console.log(`🤬 Failed to fetch data: ${error}`);
      alert("Failed to fetch data");
    }
  };

  return (
    <div
      id="signup-container"
      className="absolute -z-10 flex h-screen w-screen flex-col items-center justify-center bg-gradient-to-bl from-slate-950 from-10% via-slate-800 via-70% to-cyan-950 to-90% text-center align-middle font-mono"
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
      <img src="/src/assets/logo.png" className="mt-2 size-60" />
      <div
        id="signup-display"
        className="relative my-10 3xl:w-1/5 3xl:h-1/4 content-center rounded-2xl border-2 border-slate-950 bg-slate-950 text-center align-middle shadow-2xl shadow-slate-950 2xl:w-1/4 2xl:h-1/3 lg:w-1/3 lg:h-1/2 sm:w-1/2"
      >
        <h2 className="pb-5 text-3xl text-slate-300">Sign Up</h2>
        <form className="mx-5 grid grid-cols-2 gap-2">
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={username}
            autoComplete="username"
            onChange={(e) => setUsername(e.target.value)}
            className="rounded-md bg-slate-900 p-1 px-10 text-center text-slate-300 focus:bg-slate-800 col-span-2"
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md bg-slate-900 p-1 px-10 text-center text-slate-300 focus:bg-slate-800 col-span-2"
          />
          <input
            type="email"
            placeholder="Email Address"
            id="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md bg-slate-900 p-1 px-10 text-center text-slate-300 focus:bg-slate-800 col-span-2"
          />
          <input
            type="text"
            placeholder="First Name"
            id="first-name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="rounded-md bg-slate-900 p-1 px-10 text-center text-slate-300 focus:bg-slate-800 3xl:col-span-1 sm:col-span-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            id="last-name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="rounded-md bg-slate-900 p-1 px-10 text-center text-slate-300 focus:bg-slate-800 sm:col-span-2 3xl:col-span-1"
          />
        </form>
        <br />
        <div id="button-container" className="flex justify-center align-middle">
          <Link to={"/"}>
            <button
              className="hover:border-3 active:border-3 rounded-lg border-2 border-slate-600 bg-slate-700 px-5 py-2 text-slate-300 hover:border-slate-500 hover:bg-slate-600 hover:text-slate-200 active:border-slate-700 active:bg-slate-800 active:text-slate-400"
              type="submit"
              id="login-button"
              onClick={handleSignup}
            >
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

SignupContainer.propTypes = {
  username: PropTypes.string,
  setUsername: PropTypes.func,
  password: PropTypes.string,
  setPassword: PropTypes.func,
  email: PropTypes.string,
  setEmail: PropTypes.func,
  firstName: PropTypes.string,
  setFirstName: PropTypes.func,
  lastName: PropTypes.string,
  setLastName: PropTypes.func,
  backendUrl: PropTypes.string,
};

export default SignupContainer;
