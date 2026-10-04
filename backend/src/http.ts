import type { Request, Response, NextFunction, RequestHandler } from "express";

/** A simple HTTP error with a status code — throw it from any handler. */
export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "HttpError";
  }
}

// how this works: Express v4 doesn't catch rejected Promises from async handlers,
// so wrap them — any thrown error is forwarded to the error middleware.
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => { fn(req, res, next).catch(next); };
