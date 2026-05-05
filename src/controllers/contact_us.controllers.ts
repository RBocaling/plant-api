import { Request, Response } from "express";
import prisma from "../config/prisma";
import { sendContactEmail } from "../services/contact_us.services";

export const contactUsController = async (req: Request, res: Response) => {
  const { subject, message } = req.body;
  const userId = req.user?.id;
  let email = req.body.email;

  if (!subject || !message) {
    return res.status(400).json({ message: "Subject and message are required." });
  }

  try {
    let name = "Guest";

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId.toString() },
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      name = `${user.firstName} ${user.lastName}`;
      email = user.email;
    }

    if (!userId && !email) {
      return res.status(400).json({ message: "Email is required for guest users." });
    }

    await sendContactEmail(name, email, subject, message, userId);

    return res.status(200).json({ message: "Your message has been sent successfully!" });
  } catch (error) {
    console.error("Email sending error:", error);
    return res.status(500).json({ message: "Failed to send your message. Please try again later." });
  }
};

export const getContactUsController = async (req: Request, res: Response) => {
  try {
    const response = await prisma.contactSupport.findMany();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({
      message: error,
    });
  }
};
