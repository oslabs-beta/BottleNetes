import PropTypes from 'prop-types';

const LogInContainer = (props) => {
  const url = "http://localhost:5173/";
  const { username, password, setLoggedIn, setUsername, setPassword } = props;

  const handleLogIn = async () => {
    const credential = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(url + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credential),
      });

      if (response.ok) {
        setLoggedIn(true);
        const data = await response.json();
        console.log(data);
      } else {
        alert("Unable to send request");
      }
    } catch (error) {
      console.error(`Log in failed: ${error}`);
      alert("Unable to log in. Please check your credential.");
    }
  };

  const handleRedirect = async (endpoint) => {
    try {
      const response = await fetch(url + endpoint);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        alert("Unable to redirect to requested page");
      }
    } catch (error) {
      console.error(`Redirect failed: ${error}`);
      alert("Please try again later...");
    }
  };

  return (
    <div id="login-container">
      <h1>B o t t l e N e t e s</h1>
      <p>Logo here</p>
      <div id="loginDisplay">
        <h2>Log In</h2>
        <input
          type="text"
          placeholder="Username"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" id="login-button" onSubmit={handleLogIn}>
          Log In
        </button>
        <button
          type="submit"
          id="signup-button"
          onSubmit={() => handleRedirect("signup")}
        >
          Sign Up
        </button>
        <button
          type="submit"
          id="retrieve-button"
          onSubmit={() => handleRedirect("forgotpassword")}
        >
          Forgot your Password?
        </button>
      </div>
    </div>
  );
};

LogInContainer.propTypes = {
  username: PropTypes.string,
  password: PropTypes.string,
  setLoggedIn: PropTypes.func,
  setUsername: PropTypes.func,
  setPassword: PropTypes.func
}

export default LogInContainer;
