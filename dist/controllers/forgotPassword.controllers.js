"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitNewPassword = exports.confirmOTP = exports.requestOTP = void 0;
const forgotPassword_services_1 = require("../services/forgotPassword.services");
const requestOTP = async (req, res) => {
    const { email } = req.body;
    if (!email)
        return res.status(400).json({ message: "Email is required" });
    try {
        await (0, forgotPassword_services_1.sendOTP)(email);
        res.status(200).json({ message: "OTP sent to your email" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.requestOTP = requestOTP;
const confirmOTP = async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp)
        return res.status(400).json({ message: "Email and OTP are required" });
    try {
        await (0, forgotPassword_services_1.verifyOTP)(email, otp);
        res.status(200).json({ message: "OTP verified" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.confirmOTP = confirmOTP;
const submitNewPassword = async (req, res) => {
    const { email, otp, newPassword, confirmPassword } = req.body;
    if (!email || !otp || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    try {
        await (0, forgotPassword_services_1.verifyOTP)(email, otp);
        await (0, forgotPassword_services_1.resetPassword)(email, newPassword);
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.submitNewPassword = submitNewPassword;
