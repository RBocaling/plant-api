"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRole = exports.deleteAccount = exports.verifyAccountOtp = exports.fetchAllSubAdmin = exports.fetchAllAdminUsers = exports.fetchAllCustomerUsers = exports.removeUser = exports.updateUser = exports.updatePassword = exports.getInfo = exports.refreshAccessToken = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const auth_services_1 = require("../services/auth.services");
const token_1 = require("../utils/token");
const logs_1 = require("../utils/logs");
const notif_services_1 = require("../services/notif.services");
const register = async (req, res) => {
    const { email, password, confirmPassword, role, username, firstName, lastName, profile, } = req.body;
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email },
    });
    const existingUsername = await prisma_1.default.user.findUnique({
        where: { username },
    });
    if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
    }
    if (existingUsername) {
        return res.status(400).json({ message: "Username is already in use" });
    }
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }
    const passwordErrors = [];
    if (password.length < 8) {
        passwordErrors.push("Password must be at least 8 characters long");
    }
    if (!/[A-Z]/.test(password)) {
        passwordErrors.push("Password must include an uppercase letter");
    }
    if (!/[a-z]/.test(password)) {
        passwordErrors.push("Password must include a lowercase letter");
    }
    if (!/[0-9]/.test(password)) {
        passwordErrors.push("Password must include a number");
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        passwordErrors.push("Password must include a special character");
    }
    if (passwordErrors.length > 0) {
        return res.status(400).json({ message: passwordErrors });
    }
    if (!email || !password || !confirmPassword || !role || !username) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await (0, auth_services_1.registerUser)(email, password, role, username, firstName, lastName, profile);
        await (0, logs_1.logActivity)({
            userId: user.id,
            activity: "Registered a new account",
        });
        res.status(201).json(user);
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { identifier, password } = req.body;
    try {
        const { accessToken, refreshToken, user } = await (0, auth_services_1.loginUser)(identifier, password);
        await (0, logs_1.logActivity)({ userId: user.id, activity: "User logged in" });
        res.status(201).json({
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        res.status(401).json({ message: error.message });
    }
};
exports.login = login;
const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }
    try {
        const decoded = (0, token_1.verifyRefreshToken)(refreshToken);
        const newAccessToken = (0, token_1.generateAccessToken)(decoded.id, decoded.role);
        const newRefreshToken = (0, token_1.generateRefreshToken)(decoded.id);
        return res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid refresh token" });
    }
};
exports.refreshAccessToken = refreshAccessToken;
const getInfo = async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(400).json({ message: "Invalid user ID" });
    }
    try {
        const user = await (0, auth_services_1.userInfo)(userId);
        return res.status(200).json(user);
    }
    catch (error) {
        console.error("Controller Error - getInfo:", error);
        return res
            .status(500)
            .json({ error: error.message || "Failed to fetch user info" });
    }
};
exports.getInfo = getInfo;
const updatePassword = async (req, res) => {
    const userId = req.user?.id;
    const { currentPassword, newPassword, confirmNewPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmNewPassword || !userId) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const response = await (0, auth_services_1.changePassword)(userId?.toString(), currentPassword, newPassword, confirmNewPassword);
        await (0, logs_1.logActivity)({ userId, activity: "Changed password" });
        res.status(200).json(response);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.updatePassword = updatePassword;
const updateUser = async (req, res) => {
    const { id, email, username, firstName, lastName, profile } = req.body;
    if (!id) {
        return res.status(400).json({ message: "A valid user ID is required" });
    }
    // const user = await prisma.user.findUnique({ where: { id: Number(id) } });
    // if (!user) {
    //   return res.status(404).json({ message: `User with ID ${id} not found` });
    // }
    // if (user.role !== UserRole.CUSTOMER) {
    //   return res.status(403).json({ message: 'Only users with role CUSTOMER can be edited' });
    // }
    try {
        const updated = await (0, auth_services_1.editUser)(id, {
            email,
            username,
            firstName,
            lastName,
            profile,
        });
        await (0, logs_1.logActivity)({ userId: id, activity: "Edited user profile" });
        return res
            .status(200)
            .json({ message: "User updated successfully", data: updated });
    }
    catch (error) {
        console.error("Controller Error - updateUser:", error);
        return res
            .status(500)
            .json({ error: error.message || "Failed to update user" });
    }
};
exports.updateUser = updateUser;
const removeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }
        const result = await (0, auth_services_1.archiveUser)(userId);
        await (0, logs_1.logActivity)({
            userId: req.user?.id,
            activity: `Archived user ID ${id}`,
        });
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
exports.removeUser = removeUser;
const fetchAllCustomerUsers = async (req, res) => {
    try {
        const customers = await (0, auth_services_1.getAllCustomerUsers)();
        return res.status(200).json({
            message: "All customer users retrieved successfully",
            data: customers,
        });
    }
    catch (error) {
        console.error("Controller Error - fetchAllCustomerUsers:", error);
        return res
            .status(500)
            .json({ error: error.message || "Failed to fetch customer users" });
    }
};
exports.fetchAllCustomerUsers = fetchAllCustomerUsers;
const fetchAllAdminUsers = async (req, res) => {
    try {
        const admin = await (0, auth_services_1.getAllAdmin)();
        return res.status(200).json({
            message: "All IT ADMIN users retrieved successfully",
            data: admin,
        });
    }
    catch (error) {
        console.error("Controller Error - fetchAllAdminUsers:", error);
        return res
            .status(500)
            .json({ error: error.message || "Failed to fetch admin users" });
    }
};
exports.fetchAllAdminUsers = fetchAllAdminUsers;
const fetchAllSubAdmin = async (req, res) => {
    try {
        const admins = await (0, auth_services_1.getAllSubAdmin)();
        return res.status(200).json({
            message: "All ADMIN users retrieved successfully",
            data: admins,
        });
    }
    catch (error) {
        console.error("Controller Error - fetchAllSubAdmin:", error);
        return res
            .status(500)
            .json({ error: error.message || "Failed to fetch admins users" });
    }
};
exports.fetchAllSubAdmin = fetchAllSubAdmin;
const verifyAccountOtp = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.isRegisteredVerify) {
            return res.status(400).json({ error: "Account already verified" });
        }
        if (!user.registerOtp || user.registerOtp.toString() !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        const updatedUser = await prisma_1.default.user.update({
            where: { email },
            data: {
                isRegisteredVerify: true,
                registerOtp: null,
            },
        });
        if (!exports.updateUser || !user?.id) {
            throw new Error("user not found");
        }
        await (0, notif_services_1.createNotification)(user?.id, `Welcome ${user?.firstName}! 🎉`, "Your account has been verified. You can now log in and start using Thryve.");
        return res.status(200).json({
            message: "Account verified successfully",
            user: updatedUser,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.verifyAccountOtp = verifyAccountOtp;
const deleteAccount = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        await prisma_1.default.activityLog.deleteMany({
            where: { userId: user.id },
        });
        await prisma_1.default.user.delete({
            where: { id: user.id },
        });
        return res.status(200).json({
            message: "Account and related activity logs deleted successfully",
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.deleteAccount = deleteAccount;
const updateRole = async (req, res) => {
    const { role, id } = req.body;
    try {
        const response = await prisma_1.default.user.update({
            where: {
                id,
            },
            data: {
                role,
            },
        });
        return res.status(200).json({
            message: "role updated successfully",
            data: response,
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || "Something went wrong" });
    }
};
exports.updateRole = updateRole;
