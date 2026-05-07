"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAISupportHistory = exports.postAISupportChat = void 0;
const ai_support_chat_services_1 = require("../services/ai_support_chat.services");
const supportValidation_1 = require("../utils/supportValidation");
const prisma_1 = __importDefault(require("../config/prisma"));
const AI_CHAT_FALLBACK_MESSAGE = "We are currently unable to process AI support right now. Please try again in a moment, or submit a support ticket.";
const postAISupportChat = async (req, res) => {
    try {
        const userId = req.user?.id?.toString();
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const message = (0, supportValidation_1.validateAIChatMessage)(req.body?.message);
        const reply = await (0, ai_support_chat_services_1.generateAISupportReply)(message, userId);
        return res.status(200).json({
            success: true,
            reply,
        });
    }
    catch (error) {
        if (error?.message?.includes("AI chat message") ||
            error?.message?.includes("cannot be empty") ||
            error?.message?.includes("must not exceed")) {
            return res.status(400).json({ error: error.message });
        }
        console.error("AI support chat request failed.");
        return res.status(503).json({
            success: false,
            reply: AI_CHAT_FALLBACK_MESSAGE,
        });
    }
};
exports.postAISupportChat = postAISupportChat;
const getAISupportHistory = async (req, res) => {
    try {
        const userId = req.user?.id?.toString();
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const user = await prisma_1.default.user.findUnique({
            where: { id: userId },
            select: { id: true },
        });
        if (!user) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const data = await (0, ai_support_chat_services_1.getAISupportChatHistory)(userId, 100);
        return res.status(200).json({
            success: true,
            data,
        });
    }
    catch (error) {
        console.error("AI support chat history retrieval failed.");
        return res.status(500).json({
            success: false,
            error: "Failed to load AI support chat history.",
        });
    }
};
exports.getAISupportHistory = getAISupportHistory;
