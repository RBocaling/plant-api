"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupportRateLimiter = void 0;
const store = new Map();
const getClientKey = (req) => `${req.ip || "unknown"}:${req.path}:${req.user?.id || "guest"}`;
const createSupportRateLimiter = (maxRequests, windowMs) => {
    return (req, res, next) => {
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
exports.createSupportRateLimiter = createSupportRateLimiter;
