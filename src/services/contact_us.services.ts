import nodemailer from "nodemailer";

export const sendContactEmail = async (
  name: string,
  email: string,
  subject: string,
  message: string,
  userId?: number
) => {
  const transporter = nodemailer.createTransport({
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
