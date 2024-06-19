import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true,
    trim: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },

  fullname: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },

  avatar: {
    type: String, //Cloudinary URL
    required: true,
  },

  coverImage: {
    type: String,
  },

  watchHistory: {
    type: Schema.Types.ObjectId,
    ref: "Video",
  },
  password: {
    type: String,
    required: [true, "Password cannot be empty"],
  },
  refreshTokem: {
    type: String,
  },
});

export const User = mongoose.model("Users", userSchema);
