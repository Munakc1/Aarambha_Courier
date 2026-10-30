import { NextFunction, Request, Response } from "express";

export function notFoundHandler(
  req: Request,
  res: Response
): void {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error(error);

  if (res.headersSent) {
    next(error);
    return;
  }

  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
}