import { Request, Response } from 'express';
import { sendOTP, verifyOTP, resetPassword } from '../services/forgotPassword.services';

export const requestOTP = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    await sendOTP(email);
    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const confirmOTP = async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

  try {
    await verifyOTP(email, otp);
    res.status(200).json({ message: "OTP verified" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const submitNewPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword, confirmPassword} = req.body;
  if (!email || !otp || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    await verifyOTP(email, otp);
    await resetPassword(email, newPassword);
    res.status(200).json({ message: "Password reset successful" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
