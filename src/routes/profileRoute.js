const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler")
const authenticate = require("../middleware/auth");
const {
  getProfile,
  editProfile,
} = require("../controllers/profileController");

router
  .route("/")
  .get(authenticate, asyncHandler(getProfile))
  .put(
    authenticate,
    asyncHandler(editProfile)
  );

module.exports = router;
