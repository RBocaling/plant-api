import { Request, Response } from "express";
import {
  getSystemSettings,
  updateSystemSettings,
  isReportsEnabled,
} from "../services/systemSettings.services";
import { logActivity } from "../utils/logs";

export const getPublicSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getSystemSettings();
    return res.status(200).json({
      reportsEnabled: settings.reportsEnabled,
      feedbackEnabled: settings.feedbackEnabled,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to load settings." });
  }
};

export const getAdminSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getSystemSettings();
    return res.status(200).json({ data: settings });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to load settings." });
  }
};

export const patchAdminSettings = async (req: Request, res: Response) => {
  try {
    const { reportsEnabled, feedbackEnabled } = req.body;

    if (
      reportsEnabled !== undefined &&
      typeof reportsEnabled !== "boolean"
    ) {
      return res
        .status(400)
        .json({ error: "reportsEnabled must be a boolean." });
    }

    if (
      feedbackEnabled !== undefined &&
      typeof feedbackEnabled !== "boolean"
    ) {
      return res
        .status(400)
        .json({ error: "feedbackEnabled must be a boolean." });
    }

    const settings = await updateSystemSettings({
      ...(reportsEnabled !== undefined ? { reportsEnabled } : {}),
      ...(feedbackEnabled !== undefined ? { feedbackEnabled } : {}),
    });

    await logActivity({
      userId: String(req.user?.id || ""),
      activity: `Updated system settings (reports: ${settings.reportsEnabled}, feedback: ${settings.feedbackEnabled})`,
    });

    return res.status(200).json({
      message: "System settings updated.",
      data: settings,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to update settings." });
  }
};

export const checkReportsExport = async (req: Request, res: Response) => {
  try {
    const requesterRole = String(req.user?.role || "").toUpperCase();
    if (requesterRole === "SPECIALIST") {
      return res.status(200).json({ allowed: true });
    }

    const enabled = await isReportsEnabled();
    if (!enabled) {
      return res.status(403).json({
        error: "Reports export is currently disabled by the owner.",
      });
    }

    return res.status(200).json({ allowed: true });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Failed to verify reports access." });
  }
};
