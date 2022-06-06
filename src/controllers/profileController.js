const Profile = require("../models/profileModel");

const getProfile = async (req, res, next) => {
  const user = req.user;

  const profile = await Profile.findOne({ user: user._id });

  res.json({
    success: true,
    data: profile,
  });
};

const editProfile = async (req, res, next) => {
  const user = req.user;
  const { firstname, lastname, gender, phone, age, address } = req.body;

  const profile = await Profile.findOneAndUpdate(
    { user: user._id },
    {
      $set: {
        firstname,
        lastname,
        gender,
        phone,
        age,
        address,
      },
    }
  );

  res.status(201).json({
    success: true,
    data: profile,
    message: "Berhasil di update",
  });
};

module.exports = {
  getProfile,
  editProfile,
};
