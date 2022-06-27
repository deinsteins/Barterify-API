const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middleware/auth");
const router = express.Router();

const {
  requestBarter,
  getUserAllBarters,
  responseBarter,
} = require("../controllers/barterController");

router
  .route("/")
  .get(authenticate, asyncHandler(getUserAllBarters))
  .post(authenticate, asyncHandler(requestBarter))
  .put(authenticate, asyncHandler(responseBarter));

module.exports = router;
