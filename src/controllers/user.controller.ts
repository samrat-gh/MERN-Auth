import { Response, Request, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model";
import { create } from "domain";
import { ApiResponse } from "../utils/apiResponse";

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, fullname, username, password } = req.body;
    console.log("body: ", email, fullname, username);

    if (
      [fullname, email, username, password].some(
        (val) => val?.trim() === ("" || undefined)
      )
    ) {
      // throw new Error("Incomplete request! Missing some values");
      throw new ApiError(400, "Incomplete request! Missing some values");
    }

    //@ts-ignore
    const avatarLocalPath = req.files?.avatar[0].path;
    console.log(avatarLocalPath);

    if (!avatarLocalPath) {
      throw new ApiError(400, "Missing Avatar");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar) {
      throw new ApiError(400, "Missing Avatar");
    }

    const user = await User.create({
      fullname,
      avatar: avatar?.url,
      coverImage: "",
      email,
      password,
      username: username.toLowerCase(),
    });

    console.log(user);

    const createdUser = await User.findById(user?._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering a user!");
    }

    return res
      .status(201)
      .json(
        new ApiResponse(200, createdUser, "User Registered Successfully !")
      );
  }
);

export { registerUser };
