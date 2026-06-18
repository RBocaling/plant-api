"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOTP = exports.sendOTP = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const crypto_1 = require("crypto");
const argon2_1 = __importDefault(require("argon2"));
const email_1 = require("../utils/email");
const otpExpiryMinutes = 5;
const sendOTP = async (email) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User with this email does not exist");
    const otp = (0, crypto_1.randomInt)(1000, 9999).toString();
    const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60000);
    await prisma_1.default.oTP.upsert({
        where: { email },
        update: { otp, expiresAt },
        create: { email, otp, expiresAt }
    });
    await email_1.transporter.sendMail({
        from: `"Plant Support" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP is ${otp}. It expires in ${otpExpiryMinutes} minutes.`,
    });
};
exports.sendOTP = sendOTP;
const verifyOTP = async (email, otp) => {
    const record = await prisma_1.default.oTP.findUnique({ where: { email } });
    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
        throw new Error("Invalid or expired OTP");
    }
    return true;
};
exports.verifyOTP = verifyOTP;
const resetPassword = async (email, newPassword) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    const isSamePassword = await argon2_1.default.verify(user.password, newPassword);
    if (isSamePassword) {
        throw new Error("New password must be different from your current password");
    }
    const hashedPassword = await argon2_1.default.hash(newPassword);
    await prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword }
    });
    await prisma_1.default.oTP.delete({ where: { email } });
};
exports.resetPassword = resetPassword;
