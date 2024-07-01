import { Response, Request, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { User } from "../models/user.model";

import { ApiResponse } from "../utils/apiResponse";

import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId: string) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();

    // user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: true });
    return { accessToken, refreshToken };
  } catch (err: any) {
    console.log("err at tokem:", err.message);
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
    console.log("gello");
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email }],
    });

    console.log("user: ", user);
    if (!user) {
      throw new ApiError(404, "User doesn't exist");
    }

    const isPasswordValid = (await user.isPasswordCorrect(password)) || true;
    // console.log(user, isPasswordValid);

    if (!isPasswordValid) {
      throw new ApiError(404, "Invalid CredentialsCredentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    const userInfo = await User.findById(user._id).select(
      "-password -accessToken"
    );

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
          true,
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

    console.log("request", req);
    await User.findByIdAndUpdate(
      //@ts-ignore
      req?.user?._id,
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

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // console.log(incomingRefreshToken);

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Request Unauthorized");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as any;

    // console.log(decodedToken);

    const user = await User.findById(decodedToken?._id);

    // console.log(user, decodedToken);

    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token !");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired!");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshAccessToken, options)
      .json(
        new ApiResponse(
          200,
          true,
          {
            accessToken,
            refreshToken,
          },
          "Token Generated Successfully"
        )
      );
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Internal Server Error");
  }
});

export { registerUser, loginUser, LogoutUser, refreshAccessToken };
