import { Response, Request, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";

const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullname, username, email, password } = req.body();
    console.log(fullname, username, email, password);
  }
);

export { registerUser };
