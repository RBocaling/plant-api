"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transporter = void 0;
exports.sendEmail = sendEmail;
exports.sendVerificationEmail = sendVerificationEmail;
exports.sendPasswordResetEmail = sendPasswordResetEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: "Gmail",
    auth: {
        user: "interntracksystem@gmail.com",
        pass: "ixqy gxwb jdpr ewfo",
    },
});
async function sendEmail(to, subject, html, logoUrl) {
    try {
        const send = await exports.transporter.sendMail({
            from: "reynaldobocaling@gmail.com",
            to,
            subject: "Registration Verification",
            html,
        });
        return send;
    }
    catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error;
    }
}
/**
 * Registration Verification Email
 */
async function sendVerificationEmail(email, otp, otpExpiryMinutes) {
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0px 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #57d4b1; padding: 20px; text-align: center;">
        <img src="https://dtpwpyjtuptldgucioyn.supabase.co/storage/v1/object/public/logo/logo.png" alt="Thryve Logo" style="height: 60px; margin-bottom: 10px;" />
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to Thryve!</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px; color: #333333;">
        <p style="font-size: 16px;">Hi there,</p>
        <p style="font-size: 16px;">Thank you for registering with <b>Thryve</b>. To complete your registration, please verify your account using the OTP below:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: #57d4b1; color: #ffffff; padding: 15px 25px; font-size: 22px; border-radius: 8px; letter-spacing: 2px;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #555555;">This OTP will expire in <b>${otpExpiryMinutes}</b> minutes.</p>
        <p style="font-size: 14px; color: #555555;">If you did not create an account, please ignore this email.</p>
      </div>

      <!-- Footer -->
      <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
        <p>© ${new Date().getFullYear()} Thryve. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
    const sendResponse = sendEmail(email, "Verify Your Thryve Account", html, "https://dtpwpyjtuptldgucioyn.supabase.co/storage/v1/object/public/logo/logo.png");
    return sendResponse;
}
/**
 * Password Reset Email
 */
async function sendPasswordResetEmail(email, otp, otpExpiryMinutes) {
    const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 30px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0px 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background-color: #57d4b1; padding: 20px; text-align: center;">
        <img src="https://dtpwpyjtuptldgucioyn.supabase.co/storage/v1/object/public/logo/logo.png" alt="Thryve Logo" style="height: 60px; margin-bottom: 10px;" />
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Password Reset</h1>
      </div>
      
      <!-- Body -->
      <div style="padding: 30px; color: #333333;">
        <p style="font-size: 16px;">Hi there,</p>
        <p style="font-size: 16px;">We received a request to reset your password. Use the OTP below to proceed:</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background: #57d4b1; color: #ffffff; padding: 15px 25px; font-size: 22px; border-radius: 8px; letter-spacing: 2px;">
            ${otp}
          </span>
        </div>

        <p style="font-size: 14px; color: #555555;">This OTP will expire in <b>${otpExpiryMinutes}</b> minutes.</p>
        <p style="font-size: 14px; color: #555555;">If you did not request a password reset, please ignore this email.</p>
      </div>

      <!-- Footer -->
      <div style="background: #f1f1f1; padding: 15px; text-align: center; font-size: 12px; color: #777777;">
        <p>© ${new Date().getFullYear()} Thryve. All rights reserved.</p>
      </div>
    </div>
  </div>
  `;
    await sendEmail(email, "Password Reset OTP", html, "https://dtpwpyjtuptldgucioyn.supabase.co/storage/v1/object/public/logo/logo.png");
}
