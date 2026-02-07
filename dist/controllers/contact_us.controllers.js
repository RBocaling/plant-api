"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContactUsController = exports.contactUsController = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const contact_us_services_1 = require("../services/contact_us.services");
const contactUsController = async (req, res) => {
    const { subject, message } = req.body;
    const userId = Number(req.user?.id);
    let email = req.body.email;
    if (!subject || !message) {
        return res.status(400).json({ message: "Subject and message are required." });
    }
    try {
        let name = "Guest";
        if (userId) {
            const user = await prisma_1.default.user.findUnique({
                where: { id: userId },
                select: {
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            });
            if (!user) {
                return res.status(404).json({ message: "User not found." });
            }
            name = `${user.firstName} ${user.lastName}`;
            email = user.email;
        }
        if (!userId && !email) {
            return res.status(400).json({ message: "Email is required for guest users." });
        }
        await (0, contact_us_services_1.sendContactEmail)(name, email, subject, message, userId);
        return res.status(200).json({ message: "Your message has been sent successfully!" });
    }
    catch (error) {
        console.error("Email sending error:", error);
        return res.status(500).json({ message: "Failed to send your message. Please try again later." });
    }
};
exports.contactUsController = contactUsController;
const getContactUsController = async (req, res) => {
    try {
        const response = await prisma_1.default.contactSupport.findMany();
        return res.status(200).json(response);
    }
    catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};
exports.getContactUsController = getContactUsController;
