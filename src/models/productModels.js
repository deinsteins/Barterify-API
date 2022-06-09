const mongoose = require('mongoose')
const { Schema, model } = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    user: {
        type: ObjectID,
        ref: "user",
    },
    username: {
        type: String,
        ref: "user",
    },
    category: {
        type: ObjectID,
        ref: "productCategory",
    },
    quantity: {
      type: String,
    },
    details: {
      description: String,
      dateOfPurchase: Date,
      purchaseCondition: String,
      model: String,
      weight: String,
      color: String,
    },
    likes: [
      {
        type: ObjectID,
        ref: "user",
      },
    ],
    comments: [
      {
        type: ObjectID,
        ref: "user",
      },
    ],
    location: {
      type: "String",
      required: true
    },
  },
  { timestamps: true }
);

ProductSchema.methods.toJSON = function () {
  const product = this.toObject();
  const { _id: id, ...rest } = product;

  return {
    id,
    ...rest,
  };
};

const Product = model("product", ProductSchema);

module.exports = Product;
