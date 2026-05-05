"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = void 0;
const Roles = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.role) {
            res.status(403).json({ message: 'User role not found in token' });
            return;
        }
        if (!allowedRoles.includes(user.role)) {
            res.status(403).json({ message: 'You do not have permission to access this resource.' });
            return;
        }
        next();
    };
};
exports.Roles = Roles;
