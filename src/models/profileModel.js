const { Schema, model } = require("mongoose");

const ProfileSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
  },
  firstname: {
    type: String,
  },
  lastname: {
    type: String,
  },
  gender: {
    type: String,
  },
  phone: {
    type: Number,
  },
  age: {
    type: String,
  },
  address: {
    type: "String"
  },
  user: {
    ref: "user",
    type: Schema.Types.ObjectId,
  },
  isBanned: {
    type: Boolean,
  },
  isVerified: {
    type: Boolean,
  },
  isOnline: {
    type: Boolean,
  },
  lastActive: {
    type: Date,
  },
});

ProfileSchema.methods.toJSON = function () {
  const profile = this.toObject();
  const { _id, ...rest } = profile;

  return {
    ...rest,
  };
};

const Profile = model("profile", ProfileSchema);

module.exports = Profile;
