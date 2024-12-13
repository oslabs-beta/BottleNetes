import Users from "../models/UserModel.js";

const cookieController = {};

// Create the cookie with their id for their session when the user signed in
cookieController.createCookie = async (req, res, next) => {
  console.log("🍪 Running createCookie middleware...");

  try {
    const { username } = await req.body;
    const foundUserID = await Users.findOne({
      where: { username },
      attributes: ["id"],
    });

    if (foundUserID) {
      const cookie = await res.cookie("ssid", foundUserID.dataValues.id, {
        httpOnly: true,
        sameSite: 'Lax',
        expires: new Date(Date.now() + 3600000), // Cookie expires in 1hr
      });
      console.log(`🍪 Filling up the cookie basket...`);
      res.locals.cookie = cookie;
      // console.log(res.locals.cookie.req.cookies.ssid);
      res.locals.id = foundUserID.dataValues.id;
      // console.log(res.locals.id);
      return next();
    } else {
      return next({
        log: `🤨 Could not find user. Cookie will not be created`,
        status: 401,
        message: "Error occurred while retrieving cookies...",
      });
    }
  } catch (error) {
    return next({
      log: `🍪❌ Error occurred in createCookie middleware: ${error}`,
      status: 500,
      message: "Cannot create your Cookies!",
    });
  }
};

// Verify the cookie with their id to make sure they are the correct signed in user
// NOT CURRENTLY IN USE
cookieController.verifyCookie = async (req, res, next) => {
  console.log(`🍪🤔 Running verifyCookie middleware...`);

  try {
    const cookie = await req.cookies;
    // Check if the cookie ssid matches the user id
    if (cookie.ssid === res.locals.id) {
      console.log(`🍪 Verified session. Proceeds...`);
      res.locals.verifiedCookie = true;
      return next();
      // If they're not match, redirect them to the sign in page
    } else {
      console.log(`🍪🤨 Stop being sus. Not a match!`);
      res.locals.verifiedCookie = false;
      return next();
    }
  } catch (error) {
    return next({
      log: `😭 Error in verifyCookie middleware: ${error}`,
      status: 500,
      message: "Error while verifying session...",
    });
  }
};

export default cookieController;
