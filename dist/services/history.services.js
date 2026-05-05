"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHistoryByUser = exports.createHistory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createHistory = async (userId, plant_id, plant_name, img_url) => {
    return null;
};
exports.createHistory = createHistory;
const getHistoryByUser = async (userId) => {
    return await prisma.history.findMany({
        where: {
            userId
        },
        orderBy: {
            createdAt: 'desc'
        }
    });
};
exports.getHistoryByUser = getHistoryByUser;
