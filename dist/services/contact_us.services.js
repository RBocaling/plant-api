"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendContactEmail = async (name, email, subject, message, userId) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: `"${name}" <${email}>`,
        to: process.env.CONTACT_RECEIVER_EMAIL || process.env.EMAIL_USER,
        subject: `[Contact Us] ${subject}`,
        text: `You received a new contact form submission.

User ID: ${userId ?? "Guest"}
Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`,
    };
    await transporter.sendMail(mailOptions);
};
exports.sendContactEmail = sendContactEmail;
