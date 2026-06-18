import prisma from '../config/prisma';
import nodemailer from 'nodemailer';
import { randomInt } from 'crypto';
import argon2 from 'argon2';
import { transporter } from "../utils/email";

const otpExpiryMinutes = 5;

export const sendOTP = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User with this email does not exist");

  const otp = randomInt(1000, 9999).toString();
  const expiresAt = new Date(Date.now() + otpExpiryMinutes * 60000);

  await prisma.oTP.upsert({
    where: { email },
    update: { otp, expiresAt },
    create: { email, otp, expiresAt }
  });


  await transporter.sendMail({
    from:`"Plant Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP is ${otp}. It expires in ${otpExpiryMinutes} minutes.`,
  });
};

export const verifyOTP = async (email: string, otp: string) => {
  const record = await prisma.oTP.findUnique({ where: { email } });

  if (!record || record.otp !== otp || record.expiresAt < new Date()) {
    throw new Error("Invalid or expired OTP");
  }

  return true;
};

export const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error("User not found");
  }

  const isSamePassword = await argon2.verify(user.password, newPassword);
  if (isSamePassword) {
    throw new Error("New password must be different from your current password");
  }

  const hashedPassword = await argon2.hash(newPassword);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword }
  });

  await prisma.oTP.delete({ where: { email } });
};
