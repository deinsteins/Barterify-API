const { ObjectID } = require("mongodb");
const mongoose = require('mongoose');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const isValidObjectId = mongoose.Types.ObjectId.isValid;
const Product = require("../models/productModels.js");
const AppError = require("../utils/AppError.js");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: "barterify",
  api_key: "649787179552973",
  api_secret: "511EmBfU2CY2oIXkHoO0qAvgBU0",
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Barterify",
  },
});

const uploadImg = multer({storage: storage}).single('image');

const createProduct = async (req, res) => {
  const { filename: image } = req.file;
  const productImg = cloudinary.url(`${image}.webp`, { width: 700, height: 600, crop: 'scale', quality: 70 });
  const user = req.user;
  const productId = new ObjectID();

  const {
    name,
    price,
    category,
    categoryName,
    quantity,
    description,
    dateOfPurchase,
    location,
    waNumber,
  } = req.body;

  if (!isValidObjectId(category))
    throw new AppError("Category is not valid", 400);
    
  const newProduct = new Product({
    _id: productId,
    name,
    image: productImg,
    price,
    category,
    categoryName,
    quantity,
    description,
    dateOfPurchase,
    location,
    user: user._id,
    username: user.username,
    waNumber,
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
  const queries = req.query;
  const { page, sortBy, limit, price, category, name, location } = queries;
  const match = {};
  const sort = {};
  const searchQuery = {name: new RegExp(name)};

  if (price) match.price = price;
  if (category) match.category = category;
  if (location) match.location = location;

  if (sortBy) {
    const parts = sortBy.split(":");
    const key = parts[0];
    const value = parts[1] === "desc" ? -1 : 1;

    sort[key] = value;
  }

  if (name) {
    const productsSearch = await Product.find(searchQuery);
    res.json({
      success: true,
      data: productsSearch,
    });
  } else {
    const products = await Product.find(match)
    .skip(parseInt(page))
    .limit(parseInt(limit))
    .sort(sort);

    res.json({
      success: true,
      data: products,
    });
  }
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
    waNumber,
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
            waNumber,
            category,
            quantity,
            description,
            dateOfPurchase,
            location,
            user: user._id,
            username: user.username,
            phone: user.phone,
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
            waNumber,
            category,
            quantity,
            description,
            dateOfPurchase,
            location,
            user: user._id,
            username: user.username,
            phone: user.phone,
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
