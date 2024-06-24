import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncHandler = (
  fun: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
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
