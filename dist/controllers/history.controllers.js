"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllHistory = exports.getHistoryByUserController = exports.createHistoryController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const logs_1 = require("../utils/logs");
const generateOtp_1 = require("../utils/generateOtp");
const createHistoryController = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { plant_name, img_url, species, description, demand_philippines, scan_confidence, identified_disease, health_status, health_category, healthy, care_instructions, isOriginal, special_note, summary, } = req.body;
        if (!plant_name) {
            return res
                .status(400)
                .json({ error: "plant_id and plant_name are required." });
        }
        if (!userId) {
            return res
                .status(400)
                .json({ error: "Invalid or missing user ID from request." });
        }
        const history = await prisma_1.default.history.create({
            data: {
                plant_id: (0, generateOtp_1.generateOtp)(10)?.toString(),
                plant_name,
                img_url,
                species,
                description,
                demand_philippines,
                scan_confidence,
                identified_disease,
                health_status,
                health_category,
                healthy,
                care_instructions,
                isOriginal,
                special_note,
                summary,
                userId: userId?.toString(),
            },
        });
        await (0, logs_1.logActivity)({
            userId,
            activity: `Created history entry for plant: ${plant_name}`,
        });
        return res.status(201).json({
            message: "History entry created successfully.",
            data: history,
        });
    }
    catch (error) {
        console.error("Create History Controller Error:", error);
        return res.status(500).json({ error: "Failed to create history." });
    }
};
exports.createHistoryController = createHistoryController;
const getHistoryByUserController = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res
                .status(400)
                .json({ error: "Invalid or missing user ID from request." });
        }
        const histories = await prisma_1.default.history.findMany({
            where: { userId: userId?.toString() },
            orderBy: { createdAt: "desc" },
        });
        await (0, logs_1.logActivity)({
            userId,
            activity: "Viewed their plant history",
        });
        return res.status(200).json({
            message: "User history fetched successfully.",
            data: histories,
        });
    }
    catch (error) {
        console.error("Get History Controller Error:", error);
        return res.status(500).json({ error: "Failed to fetch user history." });
    }
};
exports.getHistoryByUserController = getHistoryByUserController;
const getAllHistory = async (req, res) => {
    try {
        const histories = await prisma_1.default.history.findMany();
        return res.status(200).json({
            message: "User history fetched successfully.",
            data: histories,
        });
    }
    catch (error) {
        console.error("Get History Controller Error:", error);
        return res.status(500).json({ error: "Failed to fetch user history." });
    }
};
exports.getAllHistory = getAllHistory;
