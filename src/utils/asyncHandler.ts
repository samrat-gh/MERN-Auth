import { Request, Response, NextFunction } from "express";

const asyncHandler = async (
  fun: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fun(req, res, next);
    } catch (err: any) {
      res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
      });
    }
  };
};

export default asyncHandler;
