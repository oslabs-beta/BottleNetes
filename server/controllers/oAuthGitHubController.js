import dotenv from "dotenv";
// import jwt from "jsonwebtoken";
import axios from "axios";
import process from "node:process";

// import { SECRET_KEY } from "../../utils/jwtUtils.js";

dotenv.config();

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;

const oAuthGitHubController = {};

oAuthGitHubController.getTemporaryCode = async (req, res, next) => {
  console.log("👩🏻‍🔧 Running getTemporaryCode middleware...");

  try {
    const temporaryCode = await req.query.code;
    if (!temporaryCode) {
      return next({
        log: "🤨 No keys retrieved",
        status: 400,
        message: "Unable to retrieve key...",
      });
    }
    res.locals.temporaryCode = temporaryCode;
    return next();
  } catch (error) {
    return next({
      log: `❌ Error occurred in getTemporeryCode middleware: ${error}`,
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
        code: res.locals.temporaryCode,
      },
      {
        headers: { Accept: "application/json" },
      },
    );

    const { access_token } = await tokenResponse.data;
    if (!access_token)
      return next({
        log: "😥 Token does not exist",
        status: 400,
        message: "Unable to retrieve token...",
      });

    res.locals.ssid = await access_token;
    res.locals.access_token = await access_token;
    return next();
  } catch (error) {
    return next({
      log: `😭 Error occurred in requestToken middleware: ${error}`,
      status: 500,
      message: "Error occurred while retrieving token",
    });
  }
};

oAuthGitHubController.getGithubUsername = async (_req, res, next) => {
  console.log("👩🏻‍🔧 Running getGithubUsername middleware...");

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
    res.locals.username = await user.login;
    res.locals.user = await user;
    return next();
  } catch (error) {
    return next({
      log: `😰 Error occurred in getGithubUsername middleware: ${error}`,
      status: 500,
      message: "Error occurred while getting username",
    });
  }
};

// oAuthGitHubController.genJWT = async (_req, res, next) => {
//   const token = jwt.sign(
//     { id: res.locals.ssid, username: res.locals.username },
//     SECRET_KEY,
//     { expiresIn: "1d" },
//   );
//   const cookie = await res.cookie("jwt", res.locals.username, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     maxAge: 24 * 60 * 60 * 1000,
//     sameSite: "strict",
//   });

//   res.locals.cookie = cookie;
//   res.locals.token = token;
//   res.locals.signedIn = true;
//   return next();
// };

export default oAuthGitHubController;
