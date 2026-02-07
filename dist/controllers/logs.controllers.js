"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllActivityLogs = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllActivityLogs = async (req, res) => {
    try {
        const response = await prisma_1.default.activityLog.findMany();
        return res.status(200).json({ message: 'All support concerns retrieved.', data: response });
    }
    catch (error) {
        console.error('Controller Error:', error);
        return res.status(500).json({ error: 'Failed to fetch support concerns.' });
    }
};
exports.getAllActivityLogs = getAllActivityLogs;
