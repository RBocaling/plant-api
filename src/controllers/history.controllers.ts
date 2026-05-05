import { Request, Response } from "express";
import prisma from "../config/prisma";
import { logActivity } from "../utils/logs";
import { generateOtp } from "../utils/generateOtp";

export const createHistoryController = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const {
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
    } = req.body;

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

    const history = await prisma.history.create({
      data: {
        plant_id: generateOtp(10)?.toString(),
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

    await logActivity({
      userId,
      activity: `Created history entry for plant: ${plant_name}`,
    });

    return res.status(201).json({
      message: "History entry created successfully.",
      data: history,
    });
  } catch (error) {
    console.error("Create History Controller Error:", error);
    return res.status(500).json({ error: "Failed to create history." });
  }
};

export const getHistoryByUserController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res
        .status(400)
        .json({ error: "Invalid or missing user ID from request." });
    }

    const histories = await prisma.history.findMany({
      where: { userId: userId?.toString() },
      orderBy: { createdAt: "desc" },
    });

    await logActivity({
      userId,
      activity: "Viewed their plant history",
    });

    return res.status(200).json({
      message: "User history fetched successfully.",
      data: histories,
    });
  } catch (error) {
    console.error("Get History Controller Error:", error);
    return res.status(500).json({ error: "Failed to fetch user history." });
  }
};

export const getAllHistory = async (req: Request, res: Response) => {
  try {
    const histories = await prisma.history.findMany();

    return res.status(200).json({
      message: "User history fetched successfully.",
      data: histories,
    });
  } catch (error) {
    console.error("Get History Controller Error:", error);
    return res.status(500).json({ error: "Failed to fetch user history." });
  }
};
