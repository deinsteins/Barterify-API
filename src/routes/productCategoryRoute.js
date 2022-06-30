const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middleware/auth");
const router = express.Router();

const {
  getCategories,
  createCategory,
} = require("../controllers/productCategoryController");

router
  .route("/")
  .get(asyncHandler(getCategories))
  .post(authenticate,asyncHandler(createCategory));

module.exports = router;
