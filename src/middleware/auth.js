const User = require("../models/user");
const AppError = require("../utils/AppError");

const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"];

  try {
    const user = await User.findByToken(token);

    if (!user) throw new AppError("Unauthorized!", 401);

    req.user = user;
    req.token = token;

    next();
  } catch ({ message, status }) {
    res.status(status).json({
      error: true,
      message,
      status,
    });
  }
};

module.exports = authenticate;
