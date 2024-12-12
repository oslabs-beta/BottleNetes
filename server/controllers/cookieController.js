const cookieController = {};

cookieController.createCookie = async (req, res, next) => {
  console.log('🍪 Running createCookie middleware...');
  
  try {
    return next();
  } catch (error) {
    return next({
      log: `🍪❌ Error occurred in createCookie middleware: ${error}`,
      status: 500,
      message: '🍪❌ Cannot create your Cookies!'
    })
  }
}

export default cookieController;