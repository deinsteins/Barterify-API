const User = require("../models/userModel");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

const Register = asyncHandler(async (req, res) => {
  const { email, username, password, password_confirmation } = req.body;

  if (password !== password_confirmation)
    throw new AppError("Password tidak sesuai", 400);

  const newUser = new User({
    email,
    username,
    password,
    password_confirmation,
  });
  const user = await newUser.save();

  if (!user) throw new AppError("An error occured", 400);

  const token = await user.generateAuthToken();

  const userWithProfile = await user.populate("profile").execPopulate();

  res.status(201).json({
    success: true,
    message: "Registrasi Berhasil",
    data: {
      user: userWithProfile,
      token: token,
    },
  });
});

const Login = asyncHandler(async (req, res) => {
  const user = await User.findByCredentials(req.body);

  if (!user) throw new AppError("Username/email belum terdaftar", 400);

  const token = await user.generateAuthToken();
  const userWithProfile = await user.populate("profile").execPopulate();

  res.json({
    success: true,
    data: {
      user: userWithProfile,
      token: token,
    },
  });
});

const PasswordReset = asyncHandler(async (req, res) => {
  const user = req.user;
  const { password, new_password, password_confirmation } = req.body;

  if (password === new_password)
    throw new AppError("Mohon pilih password yang baru", 400);

  if (new_password !== password_confirmation)
    throw new AppError("Konfirmasi Password tidak cocok ", 400);

  const userPassword = await user.verifyPassword(password);

  if (!userPassword) {
    throw new AppError("Unauthorized!", 401);
  }

  user.password = password;

  await user.save();

  res.status(201).json({
    success: true,
    message: "Reset password berhasil",
  });
});

const Logout = asyncHandler(async (req, res) => {
  const user = req.user;
  const token = req.token;

  user.tokens = user.tokens.filter((userToken) => {
    return userToken.token !== token;
  });

  await user.save();

  res.json({
    success: true,
  });
});

module.exports = {
  Register,
  Login,
  PasswordReset,
  Logout,
};
