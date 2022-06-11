const multer = require("multer");
const { ObjectID } = require("mongodb");
const mongoose = require('mongoose');
const isValidObjectId = mongoose.Types.ObjectId.isValid;
const Product = require("../models/productModels.js");
const AppError = require("../utils/AppError.js");
const fs = require('fs')

// SET STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads');
    },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});

const uploadImg = multer({storage: storage}).single('image');

const createProduct = async (req, res) => {
  const productImg = req.file.path ;
  const user = req.user;
  const productId = new ObjectID();

  const {
    name,
    price,
    category,
    quantity,
    description,
    dateOfPurchase,
    location,
  } = req.body;

  if (!isValidObjectId(category))
    throw new AppError("Category is not valid", 400);
    
  const newProduct = new Product({
    _id: productId,
    name,
    image: productImg,
    price,
    category,
    quantity,
    description,
    dateOfPurchase,
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
    image,
    price,
    category,
    quantity,
    description,
    dateOfPurchase,
    location,
  } = req.body;

  if (!isValidObjectId(category))
    throw new AppError("Category is not valid", 400);

    if(image){
      const updatedProduct = await Product.findOneAndUpdate(
        { user: user._id, _id: id },
        {
          $set: {
            name,
            image,
            price,
            category,
            quantity,
            description,
            dateOfPurchase,
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
    } else {
      const productImg = req.file.path ;
      const updatedProduct = await Product.findOneAndUpdate(
        { user: user._id, _id: id },
        {
          $set: {
            name,
            image: productImg,
            price,
            category,
            quantity,
            description,
            dateOfPurchase,
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
    }
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
  uploadImg,
};
