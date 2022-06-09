const { ObjectID } = require("mongodb");
const mongoose = require('mongoose');
const isValidObjectId = mongoose.Types.ObjectId.isValid;
const Product = require("../models/productModels.js");
const AppError = require("../utils/AppError.js");

const createProduct = async (req, res) => {
  const user = req.user;
  const productId = new ObjectID();

  const {
    name,
    price,
    category,
    quantity,
    details,
    location,
  } = req.body;

  if (!isValidObjectId(category))
    throw new AppError("Category is not valid", 400);
    
  const newProduct = new Product({
    _id: productId,
    name,
    price,
    category,
    quantity,
    details,
    location,
    user: user._id,
    username: user.username,
  });

  const product = await newProduct.save();

  user.products.push(productId);

  await user.save();

  res.status(201).json({
    success: true,
    data: product,
  });
};

const getAllProducts = async (req, res) => {
  const products = await Product.find();
  res.json({
    success: true,
    data: products,
  });
};

const getProduct = async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) throw new AppError("product id is not valid", 400);

  const product = await Product.findOne({
    _id: id,
  }).populate("product");

  if (!product) throw new AppError("product not found", 404);

  res.json({
    success: true,
    data: product,
  });
};

const getUserAllProducts = async (req, res, next) => {
  const user = req.user;
  await user
    .populate({
      path: "products",
    })
    .execPopulate();

  res.json({
    success: true,
    data: req.user.products,
  });
};

const getUserProduct = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  if (!isValidObjectId(id)) throw new AppError("product id is not valid", 400);
  const product = await Product.findOne({
    user: user._id,
    _id: id,
  }).populate("product");

  if (!product) throw new AppError("product not found", 404);

  res.json({
    success: true,
    data: product,
  });
};

const editProduct = async (req, res) => {
  const user = req.user;
  const id = req.params.id;

  if( !isValidObjectId(id) )  throw new AppError("product id is not valid", 400);


  const {
    name,
    price,
    category,
    quantity,
    details,
    media,
    location,
  } = req.body;

  if (!isValidObjectId(category))
    throw new AppError("Category is not valid", 400);

  const updatedProduct = await Product.findOneAndUpdate(
    { user: user._id, _id: id },
    {
      $set: {
        name,
        price,
        category,
        quantity,
        details,
        media,
        location,
        user: user._id,
        username: user.username,
      },
    }
  );

  if (!updatedProduct) throw new AppError("product not found", 404);

  res.status(201).json({
    success: true,
    data: updatedProduct,
  });
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  if (!isValidObjectId(id)) throw new AppError("product id is not valid", 400);

  const product = await Product.findOneAndDelete({
    _id: id,
  });

  if (!product) throw new AppError("product not found", 404);

  res.send({
    success: true,
    message: "Deleted successfully",
  });
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  getUserAllProducts,
  getUserProduct,
  editProduct,
  deleteProduct,
};
