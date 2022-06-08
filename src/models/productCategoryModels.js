const { Schema, model } = require("mongoose");

const ProductCategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "product",
      },
    ],
  },
  { timestamps: true }
);

ProductCategorySchema.methods.toJSON = function () {
  const product = this;

  const { name, _id } = product;

  return {
    name,
    id: _id,
  };
};

const ProductCategory = model("productCategory", ProductCategorySchema);

module.exports = ProductCategory;
