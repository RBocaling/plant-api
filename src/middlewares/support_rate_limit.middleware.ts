import { NextFunction, Request, Response } from "express";

type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

const getClientKey = (req: Request) =>
  `${req.ip || "unknown"}:${req.path}:${req.user?.id || "guest"}`;

export const createSupportRateLimiter = (
  maxRequests: number,
  windowMs: number
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = getClientKey(req);
    const now = Date.now();
    const bucket = store.get(key);

    if (!bucket || now > bucket.resetAt) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    if (bucket.count >= maxRequests) {
      res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
      return;
    }

    bucket.count += 1;
    store.set(key, bucket);
    next();
  };
};
