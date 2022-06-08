const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const authenticate = require("../middleware/auth");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProduct,
  getUserAllProducts,
  getUserProduct,
  editProduct,
  deleteProduct,
} = require("../controllers/productController");

router
  .route("/")
  .get(authenticate, asyncHandler(getUserAllProducts))
  .post(authenticate,asyncHandler(createProduct));

router.route("/all").get(asyncHandler(getAllProducts));
router.route("/all/:id").get(asyncHandler(getProduct));

router
  .route("/:id")
  .get(authenticate, asyncHandler(getUserProduct))
  .put(authenticate, asyncHandler(editProduct))
  .delete(authenticate, asyncHandler(deleteProduct));

module.exports = router;
