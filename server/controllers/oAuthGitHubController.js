import dotenv from "dotenv";
import axios from "axios";
import process from "node:process";

dotenv.config();

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

const oAuthGitHubController = {};

oAuthGitHubController.getCode = async (req, res, next) => {
  console.log("👩🏻‍🔧 Running getCode middleware...");

  try {
    const code = req.query.code;
    if (!code) {
      return next({
        log: "🤨 No keys retrieved",
        status: 400,
        message: "Unable to retrieve key...",
      });
    }
    res.locals.code = code;
    return next();
  } catch (error) {
    return next({
      log: `❌ Error occurred in getCode middleware: ${error}`,
      status: 500,
      message: "Error occurred while retrieving key",
    });
  }
};

oAuthGitHubController.requestToken = async (_req, res, next) => {
  console.log("👩🏻‍🔧 Running requestToken middleware...");

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: clientID,
        client_secret: clientSecret,
        code: res.locals.code,
      },
      {
        headers: { Accept: "application/json" },
      },
    );

    if (tokenResponse.data.error) {
      return next({
        log: `Unable to retrieve token: ${tokenResponse.data.error_description}`,
        status: 400,
        message: 'Unable to retrieve token',
      });
    };

    const { access_token } = tokenResponse.data;
    if (!access_token)
      return next({
        log: "😥 Token does not exist",
        status: 400,
        message: "Unable to retrieve token...",
      });

    res.locals.access_token = access_token;
    return next();
  } catch (error) {
    return next({
      log: `😭 Error occurred in requestToken middleware: ${error}`,
      status: 500,
      message: "Error occurred while retrieving token",
    });
  }
};

oAuthGitHubController.getGitHubUserData = async (_req, res, next) => {
  console.log("👩🏻‍🔧 Running getGithubUserData middleware...");

  try {
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${res.locals.access_token}`,
        "User-Agent": "BottleNetes",
        // what does this header do? It's required by GitHub API to identify the app making the request
        // https://docs.github.com/en/rest/overview/resources-in-the-rest-api#user-agent-required
        // https://developer.github.com/v3/#user-agent-required
      },
    });

    const user = await userResponse.data;

    if (!user)
      return next({
        log: "😩 User data does not exist...",
        status: 400,
        message: "Unable to retrieve user data...",
      });

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
    res.locals.authenticated = true;
    res.locals.user = user;
    return next();
  } catch (error) {
    return next({
      log: `😰 Error occurred in getGitHubUserData middleware: ${error}`,
      status: 500,
      message: "Error occurred while getting username",
    });
  }
};

export default oAuthGitHubController;
