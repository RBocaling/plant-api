import { Request, Response } from "express";
import prisma from '../config/prisma';
import {
  registerUser,
  loginUser,
  // uploadDocuments,
  userInfo,
  changePassword,
  editUser,
  getAllCustomerUsers,
  archiveUser,
  getAllAdmin,
  getAllSubAdmin,
} from "../services/auth.services";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import { UserRole } from "@prisma/client";
import { logActivity } from "../utils/logs";
import { createNotification } from "../services/notif.services";

export const register = async (req: Request, res: Response) => {
  const {
    email,
    password,
    confirmPassword,
    role,
    username,
    firstName,
    lastName,
    profile,
  } = req.body;
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const existingUsername = await prisma.user.findUnique({
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
    const user = await registerUser(
      email,
      password,
      role,
      username,
      firstName,
      lastName,
      profile
    );
    await logActivity({
      userId: user.id,
      activity: "Registered a new account",
    });
    res.status(201).json(user);
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  const { identifier, password } = req.body;

  try {
    const { accessToken, refreshToken, user } = await loginUser(
      identifier,
      password
    );

    await logActivity({ userId: user.id, activity: "User logged in" });

    res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(decoded.id, decoded.role);
    const newRefreshToken = generateRefreshToken(decoded.id);

    return res.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};

export const getInfo = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const user = await userInfo(userId);
    return res.status(200).json(user);
  } catch (error: any) {
    console.error("Controller Error - getInfo:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch user info" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { currentPassword, newPassword, confirmNewPassword } = req.body;

  if (!currentPassword || !newPassword || !confirmNewPassword || !userId) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const response = await changePassword(
     userId?.toString(),
      currentPassword,
      newPassword,
      confirmNewPassword
    );
    await logActivity({ userId, activity: "Changed password" });
    res.status(200).json(response);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUser = async (req: Request, res: Response) => {
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
    const updated = await editUser(id, {
      email,
      username,
      firstName,
      lastName,
      profile,
    });

    await logActivity({ userId:id, activity: "Edited user profile" });

    return res
      .status(200)
      .json({ message: "User updated successfully", data: updated });
  } catch (error: any) {
    console.error("Controller Error - updateUser:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to update user" });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const result = await archiveUser(userId);

    await logActivity({
      userId: req.user?.id,
      activity: `Archived user ID ${id}`,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const fetchAllCustomerUsers = async (req: Request, res: Response) => {
  try {
    const customers = await getAllCustomerUsers();
    return res.status(200).json({
      message: "All customer users retrieved successfully",
      data: customers,
    });
  } catch (error: any) {
    console.error("Controller Error - fetchAllCustomerUsers:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch customer users" });
  }
};

export const fetchAllAdminUsers = async (req: Request, res: Response) => {
  try {
    const admin = await getAllAdmin();
    return res.status(200).json({
      message: "All IT ADMIN users retrieved successfully",
      data: admin,
    });
  } catch (error: any) {
    console.error("Controller Error - fetchAllAdminUsers:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch admin users" });
  }
};

export const fetchAllSubAdmin = async (req: Request, res: Response) => {
  try {
    const admins = await getAllSubAdmin();
    return res.status(200).json({
      message: "All ADMIN users retrieved successfully",
      data: admins,
    });
  } catch (error: any) {
    console.error("Controller Error - fetchAllSubAdmin:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to fetch admins users" });
  }
};

export const verifyAccountOtp = async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  try {
    const user = await prisma.user.findUnique({
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

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        isRegisteredVerify: true,
        registerOtp: null,
      },
    });
    if (!updateUser || !user?.id) {
      throw new Error("user not found");
    }

    await createNotification(
      user?.id,
      `Welcome ${user?.firstName}! 🎉`,
      "Your account has been verified. You can now log in and start using Thryve."
    );

    return res.status(200).json({
      message: "Account verified successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.activityLog.deleteMany({
      where: { userId: user.id },
    });

    await prisma.user.delete({
      where: { id: user.id },
    });

    return res.status(200).json({
      message: "Account and related activity logs deleted successfully",
    });
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};


export const updateRole = async (req: Request, res: Response) => {
  const { role, id } = req.body;

  try {
    const response = await prisma.user.update({
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
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: error.message || "Something went wrong" });
  }
};