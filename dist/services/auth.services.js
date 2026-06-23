"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubAdmin = exports.getAllAdmin = exports.archiveUser = exports.editUser = exports.getAllCustomerUsers = exports.updateCustomerProfile = exports.userInfo = exports.changePassword = exports.loginUser = exports.resendRegistrationOtp = exports.registerAdminUser = exports.registerUser = void 0;
const argon2_1 = __importDefault(require("argon2"));
const prisma_1 = __importDefault(require("../config/prisma"));
const token_1 = require("../utils/token");
const email_1 = require("../utils/email");
const generateOtp_1 = require("../utils/generateOtp");
const registerUser = async (email, password, role, username, firstName, lastName, profile) => {
    const existing = await prisma_1.default.user.findUnique({ where: { email } });
    if (existing?.isRegisteredVerify) {
        throw new Error("Email is already in use");
    }
    const verifiedUsername = await prisma_1.default.user.findFirst({
        where: {
            username,
            isRegisteredVerify: true,
            ...(existing ? { NOT: { email } } : {}),
        },
    });
    if (verifiedUsername) {
        throw new Error("Username is already in use");
    }
    const hashedPassword = await argon2_1.default.hash(password);
    const otp = (0, generateOtp_1.generateOtp)();
    const user = existing
        ? await prisma_1.default.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role,
                username,
                firstName,
                lastName,
                profile,
                registerOtp: Number(otp),
                isRegisteredVerify: false,
            },
        })
        : await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                role,
                username,
                firstName,
                lastName,
                profile,
                registerOtp: Number(otp),
                isRegisteredVerify: false,
            },
        });
    if (!user) {
        throw new Error("User register failed");
    }
    await (0, email_1.sendVerificationEmail)(email, otp, 50);
    return user;
};
exports.registerUser = registerUser;
const registerAdminUser = async (email, password, role, username, firstName, lastName, profile) => {
    const hashedPassword = await argon2_1.default.hash(password);
    const user = await prisma_1.default.user.create({
        data: {
            email,
            password: hashedPassword,
            role,
            username,
            firstName,
            lastName,
            profile,
            isRegisteredVerify: true,
            registerOtp: null,
        },
    });
    if (!user) {
        throw new Error("User register failed");
    }
    return user;
};
exports.registerAdminUser = registerAdminUser;
const resendRegistrationOtp = async (email) => {
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.isRegisteredVerify) {
        throw new Error("Account is already verified");
    }
    const otp = (0, generateOtp_1.generateOtp)();
    await prisma_1.default.user.update({
        where: { email },
        data: { registerOtp: Number(otp) },
    });
    await (0, email_1.sendVerificationEmail)(email, otp, 50);
    return { message: "Verification code resent successfully" };
};
exports.resendRegistrationOtp = resendRegistrationOtp;
const loginUser = async (identifier, password, client = "mobile") => {
    const user = await prisma_1.default.user.findFirst({
        where: {
            OR: [{ email: identifier }, { username: identifier }],
        },
    });
    let isPasswordValid = false;
    if (user) {
        isPasswordValid = await argon2_1.default.verify(user.password, password);
    }
    if (!user && !isPasswordValid) {
        throw new Error("Invalid email or username and password!");
    }
    if (!user) {
        throw new Error("Incorrect email or username!");
    }
    if (!isPasswordValid) {
        throw new Error("Incorrect password!");
    }
    if (user.archived) {
        throw new Error("This account has been deactivated. Contact your administrator.");
    }
    if (!user.isRegisteredVerify) {
        const verificationError = new Error("Account not verified. Please verify your email to continue.");
        verificationError.requiresVerification = true;
        verificationError.email = user.email;
        throw verificationError;
    }
    const staffRoles = ["ADMIN", "OWNER", "SPECIALIST"];
    const isStaff = staffRoles.includes(user.role);
    if (client === "admin" && !isStaff) {
        throw new Error("This account cannot access the admin dashboard. Please use the mobile app.");
    }
    if (client === "mobile" && isStaff) {
        throw new Error("Staff accounts must sign in through the admin website, not the mobile app.");
    }
    return {
        accessToken: (0, token_1.generateAccessToken)(user.id, user.role),
        refreshToken: (0, token_1.generateRefreshToken)(user.id),
        user,
    };
};
exports.loginUser = loginUser;
const changePassword = async (userId, currentPassword, newPassword, confirmNewPassword) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const isPasswordValid = await argon2_1.default.verify(user.password, currentPassword);
    if (!isPasswordValid) {
        throw new Error("Current password is incorrect");
    }
    if (newPassword !== confirmNewPassword) {
        throw new Error("New password and confirm password do not match");
    }
    const isSamePassword = await argon2_1.default.verify(user.password, newPassword);
    if (isSamePassword) {
        throw new Error("New password must be different from your current password");
    }
    const newHashedPassword = await argon2_1.default.hash(newPassword);
    await prisma_1.default.user.update({
        where: { id: userId },
        data: { password: newHashedPassword },
    });
    return { message: "Password changed successfully" };
};
exports.changePassword = changePassword;
const userInfo = async (id) => {
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true,
                contactNumber: true,
                role: true,
            },
        });
        if (!user) {
            throw new Error(`User with ID ${id} not found`);
        }
        return {
            ...user,
            role: user.role.toLowerCase(),
        };
    }
    catch (error) {
        console.error("Service Error - userInfo:", error);
        throw new Error("Failed to retrieve user info");
    }
};
exports.userInfo = userInfo;
const updateCustomerProfile = async (userId, updates) => {
    const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new Error("User not found");
    }
    if (user.role !== "CUSTOMER") {
        throw new Error("Only customer profiles can be updated from the mobile app.");
    }
    if (updates.username && updates.username !== user.username) {
        const usernameConflict = await prisma_1.default.user.findFirst({
            where: {
                username: updates.username,
                isRegisteredVerify: true,
                NOT: { id: userId },
            },
        });
        if (usernameConflict) {
            throw new Error("Username is already in use");
        }
    }
    const updated = await prisma_1.default.user.update({
        where: { id: userId },
        data: {
            ...(updates.firstName !== undefined ? { firstName: updates.firstName } : {}),
            ...(updates.lastName !== undefined ? { lastName: updates.lastName } : {}),
            ...(updates.username !== undefined ? { username: updates.username } : {}),
            ...(updates.contactNumber !== undefined
                ? { contactNumber: updates.contactNumber }
                : {}),
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            username: true,
            contactNumber: true,
            role: true,
        },
    });
    return {
        ...updated,
        role: updated.role.toLowerCase(),
    };
};
exports.updateCustomerProfile = updateCustomerProfile;
const getAllCustomerUsers = async () => {
    try {
        const customers = await prisma_1.default.user.findMany({
            where: { archived: false },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true,
                role: true,
                createdAt: true,
                // role: true,
            },
        });
        return customers;
    }
    catch (error) {
        console.error('Service Error - getAllCustomerUsers:', error);
        throw new Error('Failed to retrieve customer users');
    }
};
exports.getAllCustomerUsers = getAllCustomerUsers;
const editUser = async (userId, updates) => {
    // const user = await prisma.user.findUnique({
    //   where: { id: userId },
    // });
    // if (!user) {
    //   throw new Error(`User with ID ${userId} not found`);
    // }
    //   if (user.role !== 'CUSTOMER') {
    //   throw new Error(`Only users with the role 'CUSTOMER' can be edited`);
    // }
    const updated = await prisma_1.default.user.update({
        where: { id: userId },
        data: updates,
        select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
        },
    });
    return updated;
};
exports.editUser = editUser;
const archiveUser = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new Error(`User with ID ${userId} not found`);
    }
    if (user.role === "CUSTOMER") {
        throw new Error("Customer accounts cannot be removed from the admin panel.");
    }
    if (user.role === "OWNER") {
        throw new Error("Plant Store Owner accounts cannot be removed.");
    }
    if (user.role !== "ADMIN" && user.role !== "SPECIALIST") {
        throw new Error("This staff account cannot be removed.");
    }
    const archivedUser = await prisma_1.default.user.update({
        where: { id: userId },
        data: { archived: true },
        select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            archived: true,
        },
    });
    return {
        message: `User with ID ${userId} archived successfully.`,
        user: archivedUser,
    };
};
exports.archiveUser = archiveUser;
const getAllAdmin = async () => {
    try {
        const admin = await prisma_1.default.user.findMany({
            where: { role: "ADMIN" },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true,
                role: true
                // role: true,
            },
        });
        return admin;
    }
    catch (error) {
        console.error('Service Error - getAllAdmin:', error);
        throw new Error('Failed to retrieve admin users');
    }
};
exports.getAllAdmin = getAllAdmin;
const getAllSubAdmin = async () => {
    try {
        const admins = await prisma_1.default.user.findMany({
            where: {
                role: {
                    in: ["SPECIALIST", "OWNER"],
                },
            },
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true,
                role: true
            },
        });
        return admins;
    }
    catch (error) {
        console.error('Service Error - getAllAdmin:', error);
        throw new Error('Failed to retrieve admin users');
    }
};
exports.getAllSubAdmin = getAllSubAdmin;
