declare global {
  namespace Express {
    interface Request {
      vendorId?: string;
    }
  }
}

export {};