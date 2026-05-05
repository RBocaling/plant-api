"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactSupport = exports.getAllContactSupport = exports.replyToContactSupport = exports.insertContactSupport = void 0;
const email_1 = require("../utils/email");
const prisma_1 = __importDefault(require("../config/prisma"));
const insertContactSupport = async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
        let parent = await prisma_1.default.contactSupportParent.findUnique({
            where: { email },
        });
        if (!parent) {
            parent = await prisma_1.default.contactSupportParent.create({ data: { email } });
        }
        const contact = await prisma_1.default.contactSupport.create({
            data: {
                name,
                subject,
                message,
                parentId: parent.id,
            },
            include: { contactSupportReplyOwner: true },
        });
        return res.status(200).json({
            message: "Support request submitted successfully",
            contact,
        });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.insertContactSupport = insertContactSupport;
// Owner reply
const replyToContactSupport = async (req, res) => {
    const { contactSupportId, subject, message } = req.body;
    try {
        const contact = await prisma_1.default.contactSupport.findUnique({
            where: { id: contactSupportId },
            include: { parent: true },
        });
        if (!contact)
            return res.status(404).json({ error: "Support request not found" });
        const reply = await prisma_1.default.contactSupportReplyOwner.create({
            data: {
                subject,
                message,
                contactSupportId: contact.id,
            },
        });
        await (0, email_1.sendEmail)(contact.parent.email, `Support Reply: ${subject}`, `
        <h2 style="color:#57d4b1;">Thryve Support</h2>
        <p>Hi, here is our reply to your request:</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
        <p>Thank you for reaching out!</p>
      `, "https://dtpwpyjtuptldgucioyn.supabase.co/storage/v1/object/public/logo/logo.png");
        return res.status(200).json({ message: "Reply sent successfully", reply });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.replyToContactSupport = replyToContactSupport;
const getAllContactSupport = async (_req, res) => {
    try {
        const parents = await prisma_1.default.contactSupportParent.findMany({
            include: {
                contactSupports: {
                    include: {
                        contactSupportReplyOwner: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        if (!parents.length) {
            return res
                .status(404)
                .json({ error: "No contact support submissions found" });
        }
        return res.status(200).json({ parents });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.getAllContactSupport = getAllContactSupport;
// Delete a single support message (optional)
const deleteContactSupport = async (req, res) => {
    const { id } = req.params;
    try {
        await prisma_1.default.contactSupportReplyOwner.deleteMany({
            where: { contactSupportId: Number(id) },
        });
        await prisma_1.default.contactSupport.delete({ where: { id: Number(id) } });
        return res
            .status(200)
            .json({ message: "Support message and replies deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
exports.deleteContactSupport = deleteContactSupport;
