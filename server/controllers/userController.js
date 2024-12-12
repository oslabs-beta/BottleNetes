import Users from "../models/UserModel.js";
import bcrypt from 'bcrypt';

const userController = {};

userController.createNewUser = async (req, res, next) => {
  console.log("👥 Running createNewUser middleware...");

  try {
    const { username, password, email } = await req.body;
    if (!username || !password || !email) {
      return next({
        log: "Required credentials are not provided",
        status: 500,
        message: "One or more required fields are missing.",
      });
    }

    const newUser = await Users.create({
      username,
      password_hash: password,
      email,
    });
    console.log("✅ User created: ", newUser.toJSON());
    res.locals.newUser = newUser;
    return next();
  } catch (error) {
    return next({
      log: `🤦🏻 Error in createNewUser middleware: ${error}`,
      status: 500,
      message: "🤦🏻 Could not create new user",
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  console.log("🤖 Running verifyUser middleware...");

  try {
    const { username, password } = await req.body;
    const credentials = await Users.findOne({
      where: { username },
      attributes: ['username', 'password_hash']
    });
    console.log(credentials.dataValues);
    if (credentials) {
      const isMatch = await bcrypt.compare(password, credentials.dataValues.password_hash);
      if (isMatch) {
        console.log('🥳 Password Matched!');
        res.locals.validated = isMatch;
        return next();
      } else {
        console.log('🤔 Wrong Password!');
        res.locals.validated = isMatch;
        return next()
      }
    } else {
      return next({
        log: "🤨 Credential provided does not matched!",
        status: 400,
        message: "🤨 Credential provided does not matched!"
      });
    }
  } catch (error) {
    return next({
      log: `🤬 Error in verifyUser middleware: ${error}`,
      status: 500,
      message: "Could not log in...",
    });
  }
};

export default userController;
