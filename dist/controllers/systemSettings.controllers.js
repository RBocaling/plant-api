"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkReportsExport = exports.patchAdminSettings = exports.getAdminSettings = exports.getPublicSettings = void 0;
const systemSettings_services_1 = require("../services/systemSettings.services");
const logs_1 = require("../utils/logs");
const getPublicSettings = async (_req, res) => {
    try {
        const settings = await (0, systemSettings_services_1.getSystemSettings)();
        return res.status(200).json({
            reportsEnabled: settings.reportsEnabled,
            feedbackEnabled: settings.feedbackEnabled,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Failed to load settings." });
    }
};
exports.getPublicSettings = getPublicSettings;
const getAdminSettings = async (_req, res) => {
    try {
        const settings = await (0, systemSettings_services_1.getSystemSettings)();
        return res.status(200).json({ data: settings });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Failed to load settings." });
    }
};
exports.getAdminSettings = getAdminSettings;
const patchAdminSettings = async (req, res) => {
    try {
        const { reportsEnabled, feedbackEnabled } = req.body;
        if (reportsEnabled !== undefined &&
            typeof reportsEnabled !== "boolean") {
            return res
                .status(400)
                .json({ error: "reportsEnabled must be a boolean." });
        }
        if (feedbackEnabled !== undefined &&
            typeof feedbackEnabled !== "boolean") {
            return res
                .status(400)
                .json({ error: "feedbackEnabled must be a boolean." });
        }
        const settings = await (0, systemSettings_services_1.updateSystemSettings)({
            ...(reportsEnabled !== undefined ? { reportsEnabled } : {}),
            ...(feedbackEnabled !== undefined ? { feedbackEnabled } : {}),
        });
        await (0, logs_1.logActivity)({
            userId: String(req.user?.id || ""),
            activity: `Updated system settings (reports: ${settings.reportsEnabled}, feedback: ${settings.feedbackEnabled})`,
        });
        return res.status(200).json({
            message: "System settings updated.",
            data: settings,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Failed to update settings." });
    }
};
exports.patchAdminSettings = patchAdminSettings;
const checkReportsExport = async (req, res) => {
    try {
        const requesterRole = String(req.user?.role || "").toUpperCase();
        if (requesterRole === "SPECIALIST") {
            return res.status(200).json({ allowed: true });
        }
        const enabled = await (0, systemSettings_services_1.isReportsEnabled)();
        if (!enabled) {
            return res.status(403).json({
                error: "Reports export is currently disabled by the owner.",
            });
        }
        return res.status(200).json({ allowed: true });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Failed to verify reports access." });
    }
};
exports.checkReportsExport = checkReportsExport;
