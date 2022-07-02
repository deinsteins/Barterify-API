const mongoose = require('mongoose')
const { Schema, model } = require("mongoose");
const ObjectID = mongoose.Schema.Types.ObjectId;

const BarterSchema = new Schema(
  {
    productId: {
        type: String,
        ref: "product",
    },
    productName: {
      type: String,
      ref: "product",
    },
    senderId: {
        type: ObjectID,
        ref: "user",
    },
    senderName: {
      type: String,
      ref: "user",
    },
    receiverId: {
        type: ObjectID,
        ref: "user",
    },
    receiverName: {
      type: String,
      ref: "user",
    },
    waNumber: {
      type: String,
      ref: "profile",
    },
    message: {
      type: String,
      required: true,
    },
    offer: {
        type: String,
        ref: "product", 
    },
    productOfferId: {
      type: String,
      ref: "product", 
    },
    status: {
        type: String,
        default: "terkirim",
    }
  },
  { timestamps: true }
);

const Barter = model("barter", BarterSchema);

module.exports = Barter;
