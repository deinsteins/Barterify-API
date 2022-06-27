const { ObjectID } = require("mongodb");
const mongoose = require('mongoose');
const isValidObjectId = mongoose.Types.ObjectId.isValid;
const Barter = require("../models/barterModel");
const User = require("../models/userModel");
const Profile = require("../models/profileModel");
const AppError = require("../utils/AppError");

const requestBarter = async (req, res, next) => {
    const user = req.user;
    const barterId = new ObjectID();

    const profile = await Profile.findOne({
      user: user._id,
    }).populate("profile");

    console.log(profile);
    const {
        productId,
        productName,
        receiverId,
        receiverName,
        offer,
        productOfferId,
        message,
      } = req.body;
    
      if (!isValidObjectId(productId))
        throw new AppError("Product is not valid", 400);

        const receiver = await User.findOne({
            _id: receiverId,
          })

      const newBarter = new Barter({
        _id: barterId,
        productId,
        productName,
        senderId: user._id,
        senderName: user.username,
        receiverId,
        receiverName,
        message,
        offer,
        productOfferId,
        waNumber: profile.phone,
      });
    
      const barter = await newBarter.save();
    
      user.barters.push(barterId);
      receiver.barters.push(barterId);

      await user.save();
      await receiver.save();
    
      res.status(201).json({
        success: true,
        data: barter,
      });
};

const responseBarter = async (req, res, next) => {
  const user = req.user;

  const {
      barterId,
      status,
    } = req.body;
  
    if (!isValidObjectId(barterId))
      throw new AppError("Barter is not valid", 400);

    const updatedBarter = await Barter.findOneAndUpdate(
      { receiverId: user._id, _id: barterId },
      {
        $set: {
          status,
        },
      }
    );
    console.log(updatedBarter);
    if (!updatedBarter) throw new AppError("Barter not found", 404);
    res.status(201).json({
      success: true,
      data: updatedBarter,
    });
};

const getUserAllBarters = async (req, res, next) => {
    const user = req.user;
    await user
      .populate({
        path: "barters",
      })
      .execPopulate();
  
    res.json({
      success: true,
      data: req.user.barters,
    });
  };


module.exports = {
  requestBarter,
  getUserAllBarters,
  responseBarter,
};
