import mongoose, { Schema } from "mongoose";

import brcypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
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

    password: {
      type: String,
      required: [true, "Password cannot be empty"],
    },
    refreshTokem: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//no arrow function because it doesn't have refrence to this keyword
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await brcypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await brcypt.compare(password, this.password);
};

userSchema.methods.accessToken = function () {
  return jwt.sign(
    {
      _id: this.id,
      username: this.username,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET,
    }
  );
};

userSchema.methods.refreshToken = function () {
  return jwt.sign(
    {
      _id: this.id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_SECRET,
    }
  );
};
export const User = mongoose.model("Users", userSchema);
