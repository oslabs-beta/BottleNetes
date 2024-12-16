/* eslint-disable no-undef */
import dotenv from "dotenv";

dotenv.config();

const oAuthController = {};

oAuthController.getTemporaryCode = (req, res, next) => {
  const temporaryCode = req.query.code;
  if (!temporaryCode) {
    return next("No temporary code received from GitHub");
  }
  res.locals.temporaryCode = temporaryCode;
  return next();
};

oAuthController.requestToken = async (req, res, next) => {
  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        body: JSON.stringify({
          code: res.locals.temporaryCode,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
        }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    const data = await response.json();
    console.log("GitHub token response:", data);

    const githubToken = data.access_token;
    if (!githubToken) {
      return next("Failed to obtain access token from GitHub");
    }

    res.locals.token = githubToken;
    res.locals.ssid = githubToken;
    return next();
  } catch (err) {
    return next(`Error in requestToken: ${err}`);
  }
};

oAuthController.getGithubUsername = async (req, res, next) => {
  try {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${res.locals.token}`,
        "User-Agent": "BottleNetes",
        // what does this header do? It's required by GitHub API to identify the app making the request
        // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#user-agent-required
        // https://developer.github.com/v3/#user-agent-required
      },
    });

    const data = await response.json();
    console.log("GitHub user data:", data);

    const githubUsername = data.login;
    // sample response of data:
    // {
    //   login: 'github_username',
    //   id: 1234567,
    //   node_id: 'node_id',
    //   avatar_url: 'avatar_url',
    //   gravatar_id: '',
    //   url: 'https://api.github.com/users/github_username',
    //   html_url: '
    //   followers_url: 'https://api.github.com/users/github_username/followers',
    //   ...
    // }

    if (!githubUsername) {
      return next("Failed to get GitHub username");
    }
    res.locals.username = githubUsername;
    return next();
  } catch (err) {
    return next(`Error in getGithubUsername: ${err}`);
  }
};

export default oAuthController;
