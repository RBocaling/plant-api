import { Request, Response } from "express";
import {
  generateAISupportReply,
  getAISupportChatHistory,
} from "../services/ai_support_chat.services";
import { validateAIChatMessage } from "../utils/supportValidation";
import prisma from "../config/prisma";

const AI_CHAT_FALLBACK_MESSAGE =
  "We are currently unable to process AI support right now. Please try again in a moment, or submit a support ticket.";

export const postAISupportChat = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id?.toString();
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const message = validateAIChatMessage(req.body?.message);
    const reply = await generateAISupportReply(message, userId);

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error: any) {
    if (
      error?.message?.includes("AI chat message") ||
      error?.message?.includes("cannot be empty") ||
      error?.message?.includes("must not exceed")
    ) {
      return res.status(400).json({ error: error.message });
    }

    console.error("AI support chat request failed.");
    return res.status(503).json({
      success: false,
      reply: AI_CHAT_FALLBACK_MESSAGE,
    });
  }
};

export const getAISupportHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id?.toString();
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const data = await getAISupportChatHistory(userId, 100);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("AI support chat history retrieval failed.");
    return res.status(500).json({
      success: false,
      error: "Failed to load AI support chat history.",
    });
  }
};
