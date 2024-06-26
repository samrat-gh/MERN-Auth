import { Response, Request, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";

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

    return res.status(200).json({
      message: "ok",
    });
  }
);

export { registerUser };
