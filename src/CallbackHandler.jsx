// Run when redirected to the callback route of GitHub OAuth
import { useEffect } from "react";
import useStore from "./store.jsx";
import PropTypes from "prop-types";

const CallbackHandler = ({ backendUrl }) => {
  const signIn = useStore((state) => state.signIn);

  useEffect(() => {
    const fetchToken = async () => {
      // URLSearchParams will get all queries inside of the passed in URL
      // Ex: const url = http://localhost:3000/oauth/github?key1=value1&key2=value2
      // params = new URLSearchParams(new URL(url).search);
      // for (const [key, value] of params.entries()) {
      //   console.log(`${key}: ${value});
      //   => key1: value1;
      //   => key2: value2;
      // };

      // 'window.location.search' will search for a query string inside the location property of the window object
      // Query string is a string format, a part of the url including the ? and containing the queries

      const params = new URLSearchParams(window.location.search);
      if (!params) return console.error("Unable to get the queries");

      //Getting the query with the key "code";
      const code = params.get("code");
      if (!code)
        return console.error("Unable to get the code inside the query");

      try {
        const response = await fetch(backendUrl + "/oauth/github", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          console.error(
            `Error occurred while fetching from OAuth GitHub callback: ${response.status}`,
          );
        }

        const data = await response.json();
        console.log(data);

        // Set the token received from the back to localStorage
        if (!data.token) console.error("Unable to retrieve token.");

        console.log("Successfully retrieved token.");
        localStorage.setItem("token", data.token);
        signIn();
      } catch (error) {
        console.error(`Error occurred while exchanging token: ${error}`);
      }
    };

    fetchToken();
  }, [signIn, backendUrl]);
};

CallbackHandler.propTypes = {
  backendUrl: PropTypes.func.isRequired,
};

export default CallbackHandler;
