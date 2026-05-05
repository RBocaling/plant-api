"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserCount = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getUserCount = async () => {
    try {
        const count = await prisma_1.default.user.count();
        return count;
    }
    catch (error) {
        throw new Error("Error getting user count");
    }
};
exports.getUserCount = getUserCount;
