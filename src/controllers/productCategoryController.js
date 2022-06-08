const ProductCategory = require("../models/productCategoryModels");
const AppError = require("../utils/AppError");

const createCategory = async (req, res, next) => {
  const { name } = req.body;
  const formatname = name.toLowerCase();

  const isCategoryExist = await ProductCategory.findOne({ name: formatname });

  if (isCategoryExist) throw new AppError("category already exists", 409);

  const newCategory = new ProductCategory({ name: formatname });

  const category = await newCategory.save();

  res.status(201).json({
    success: true,
    data: category,
  });
};

const getCategories = async (req, res, next) => {
  const categories = await ProductCategory.find({});

  res.json({
    success: true,
    data: categories,
  });
};


module.exports = {
  createCategory,
  getCategories,
};
