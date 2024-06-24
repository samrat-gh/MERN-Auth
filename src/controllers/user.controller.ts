import { Response, Request, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({
      message: "ok",
    });
  }
);

export { registerUser };
