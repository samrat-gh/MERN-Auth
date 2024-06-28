import { Response, Request, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model";

import { ApiResponse } from "../utils/apiResponse";
import { access } from "fs";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.accessToken();
    const refreshToken = user.refreshToken();

    // user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: true });
    return { accessToken, refreshToken };
  } catch (err: any) {
    throw new ApiError(500, "Something went Wrong while generating tokens");
  }
};

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

const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;

    const user = User.findOne({
      $or: [{ username }, { email }],
    });

    if (!user) {
      throw new ApiError(404, "User doesn't exist");
    }

    //@ts-ignore
    const isPasswordValid = await user.isPasswordCorrect(password);
    console.log(user, isPasswordValid);

    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid CredentialsCredentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      //@ts-expect-error
      user?._id
    );

    const userInfo = user
      .findById(
        //@ts-expect-error
        user._id
      )
      .select("-password -accessToken");

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          //@ts-expect-error
          {
            user: userInfo,
            accessToken,
            refreshToken,
          },
          "User logged in successfully "
        )
      );
  }
);

const LogoutUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = {
      httpOnly: true,
      secure: true,
    };

    await User.findByIdAndUpdate(
      //@ts-ignore
      req.user?._id,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, true, "User Logged out Successfully"));
  }
);

export { registerUser, loginUser, LogoutUser };
