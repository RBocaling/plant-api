"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserNotifications = exports.createNotification = void 0;
const notifServices = __importStar(require("../services/notif.services"));
const createNotification = async (req, res) => {
    const userId = req.user?.id;
    const { title, description } = req.body;
    if (!userId || !title || !description) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
    }
    try {
        const notif = await notifServices.createNotification(userId, title, description);
        res.status(201).json(notif);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createNotification = createNotification;
const getUserNotifications = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        res.status(400).json({ error: 'Missing user ID' });
        return;
    }
    try {
        const notifications = await notifServices.getNotificationsByUser(userId);
        if (!notifications || notifications.length === 0) {
            res.status(404).json({ error: 'No notifications found' });
            return;
        }
        res.status(200).json({ data: notifications });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getUserNotifications = getUserNotifications;
