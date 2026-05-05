"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logActivity = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const logActivity = async ({ userId, activity, }) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: userId }, select: { username: true }, });
        if (!user)
            throw new Error('User not found');
        await prisma.activityLog.create({
            data: {
                userId,
                username: user.username,
                activity,
            },
        });
    }
    catch (error) {
        console.error('Failed to log activity:', error);
    }
};
exports.logActivity = logActivity;
