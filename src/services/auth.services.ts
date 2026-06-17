import argon2 from 'argon2';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/token';
import { sendVerificationEmail } from "../utils/email";
import { generateOtp } from "../utils/generateOtp";

export const registerUser = async (
  email: string,
  password: string,
  role: any,
  username: string,
  firstName: string,
  lastName: string,
  profile?: string
) => {
  const hashedPassword = await argon2.hash(password);
  const otp = generateOtp();
  const user = await prisma.user.create({
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
  const send = await sendVerificationEmail(email, otp, 50);
  console.log("send", send);

  return user;
};

export const resendRegistrationOtp = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.isRegisteredVerify) {
    throw new Error("Account is already verified");
  }

  const otp = generateOtp();
  await prisma.user.update({
    where: { email },
    data: { registerOtp: Number(otp) },
  });

  await sendVerificationEmail(email, otp, 50);
  return { message: "Verification code resent successfully" };
};

export const loginUser = async (identifier: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { username: identifier }],
    },
  });

  let isPasswordValid = false;

  if (user) {
    isPasswordValid = await argon2.verify(user.password, password);
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
  if (!user.isRegisteredVerify) {
    throw new Error(
      "Account not verified. Please check your email to verify your account."
    );
  }

  return {
    accessToken: generateAccessToken(user.id, user.role),
    refreshToken: generateRefreshToken(user.id),
    user,
  };
};

export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string,
  confirmNewPassword: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await argon2.verify(user.password, currentPassword);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  if (newPassword !== confirmNewPassword) {
    throw new Error("New password and confirm password do not match");
  }

  const newHashedPassword = await argon2.hash(newPassword);

  await prisma.user.update({
    where: { id: userId },
    data: { password: newHashedPassword },
  });

  return { message: "Password changed successfully" };
};


export const userInfo = async (id: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id:true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
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
  } catch (error) {
    console.error('Service Error - userInfo:', error);
    throw new Error('Failed to retrieve user info');
  }
};

export const getAllCustomerUsers = async () => {
  try {
    const customers = await prisma.user.findMany({
      // where: { role: UserRole.CUSTOMER },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        role:true,
        createdAt: true,
        // role: true,
      },
    });

    return customers;
  } catch (error) {
    console.error('Service Error - getAllCustomerUsers:', error);
    throw new Error('Failed to retrieve customer users');
  }
};

export const editUser = async (
  userId: any,
  updates: {
    email?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    profile?: string;
  }
) => {
  // const user = await prisma.user.findUnique({
  //   where: { id: userId },
  // });

  // if (!user) {
  //   throw new Error(`User with ID ${userId} not found`);
  // }

  //   if (user.role !== 'CUSTOMER') {
  //   throw new Error(`Only users with the role 'CUSTOMER' can be edited`);
  // }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
    id: true,
    email: true,
    username: true,
    firstName: true,
    lastName: true,
  },
  });

  return updated;
};

export const archiveUser = async (userId: any) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error(`User with ID ${userId} not found`);
  }

  if (user.role !== 'CUSTOMER') {
    throw new Error(`Only users with the role 'CUSTOMER' can be archived`);
  }

  const archivedUser = await prisma.user.update({
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

export const getAllAdmin = async () => {
  try {
    const admin = await prisma.user.findMany({
       where: { role: "ADMIN" },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        role:true
        // role: true,
      },
    });

    return admin;
  } catch (error) {
    console.error('Service Error - getAllAdmin:', error);
    throw new Error('Failed to retrieve admin users');
  }
};

export const getAllSubAdmin = async () => {
  try {
    const admins = await prisma.user.findMany({
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
        role:true
      },
    });

    return admins;
  } catch (error) {
    console.error('Service Error - getAllAdmin:', error);
    throw new Error('Failed to retrieve admin users');
  }
};
