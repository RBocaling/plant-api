"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNotificationsByUser = exports.createNotification = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createNotification = async (userId, title, description) => {
    return await prisma.notif.create({
        data: {
            title,
            description,
            user: {
                connect: { id: userId }
            }
        }
    });
};
exports.createNotification = createNotification;
const getNotificationsByUser = async (userId) => {
    return await prisma.notif.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};
exports.getNotificationsByUser = getNotificationsByUser;
