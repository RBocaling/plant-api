"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReportsEnabled = exports.isFeedbackEnabled = exports.updateSystemSettings = exports.getSystemSettings = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const SETTINGS_ID = "global";
const getSystemSettings = async () => {
    return prisma_1.default.systemSettings.upsert({
        where: { id: SETTINGS_ID },
        update: {},
        create: {
            id: SETTINGS_ID,
            reportsEnabled: true,
            feedbackEnabled: true,
        },
    });
};
exports.getSystemSettings = getSystemSettings;
const updateSystemSettings = async (data) => {
    await (0, exports.getSystemSettings)();
    return prisma_1.default.systemSettings.update({
        where: { id: SETTINGS_ID },
        data,
    });
};
exports.updateSystemSettings = updateSystemSettings;
const isFeedbackEnabled = async () => {
    const settings = await (0, exports.getSystemSettings)();
    return settings.feedbackEnabled;
};
exports.isFeedbackEnabled = isFeedbackEnabled;
const isReportsEnabled = async () => {
    const settings = await (0, exports.getSystemSettings)();
    return settings.reportsEnabled;
};
exports.isReportsEnabled = isReportsEnabled;
