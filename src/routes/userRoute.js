const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const {
  Register,
  Login,
  PasswordReset,
  Logout,
} = require("../controllers/userController");

router.post("/register", Register);
router.post("/login", Login);
router.post(
  "/password-reset",
  authenticate,
  PasswordReset
);
router.post("/logout", authenticate, Logout);

module.exports = router;
