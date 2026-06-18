import { Request, Response } from "express";
import { sendEmail } from "../utils/email";
import prisma from "../config/prisma";

const URGENCY_HOURS: Record<string, number> = {
  low: 48,
  medium: 24,
  high: 12,
  urgent: 4,
};

const VALID_URGENCIES = Object.keys(URGENCY_HOURS);

export const insertContactSupport = async (req: Request, res: Response) => {
  const { name, email, subject, message, urgency = "medium" } = req.body;

  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return res.status(400).json({
      error: "Name, email, subject, and message are required.",
    });
  }

  if (!VALID_URGENCIES.includes(urgency)) {
    return res.status(400).json({
      error: "Invalid urgency level. Choose low, medium, high, or urgent.",
    });
  }

  const expectedResponseHours = URGENCY_HOURS[urgency];

  try {
    let parent = await prisma.contactSupportParent.findUnique({
      where: { email },
    });
    if (!parent) {
      parent = await prisma.contactSupportParent.create({ data: { email } });
    }

    const contact = await prisma.contactSupport.create({
      data: {
        name: name.trim(),
        subject: subject.trim(),
        message: message.trim(),
        urgency,
        expectedResponseHours,
        parentId: parent.id,
      },
      include: { contactSupportReplyOwner: true },
    });

    return res.status(200).json({
      message: "Support request submitted successfully",
      acknowledgement: `Your concern has been received. Our support team will review it and respond soon. Expected owner response within ${expectedResponseHours} hour${expectedResponseHours === 1 ? "" : "s"}.`,
      expectedResponseHours,
      contact,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Owner reply
export const replyToContactSupport = async (req: Request, res: Response) => {
  const { contactSupportId, subject, message } = req.body;

  try {
    const contact = await prisma.contactSupport.findUnique({
      where: { id: contactSupportId },
      include: { parent: true },
    });

    if (!contact)
      return res.status(404).json({ error: "Support request not found" });

    const reply = await prisma.contactSupportReplyOwner.create({
      data: {
        subject,
        message,
        contactSupportId: contact.id,
      },
    });

    await sendEmail(
      contact.parent.email,
      `Support Reply: ${subject}`,
      `
        <h2 style="color:#57d4b1;">Thryve Support</h2>
        <p>Hi, here is our reply to your request:</p>
        <p><b>Subject:</b> ${subject}</p>
        <p><b>Message:</b> ${message}</p>
        <p>Thank you for reaching out!</p>
      `,
      "https://dtpwpyjtuptldgucioyn.supabase.co/storage/v1/object/public/logo/logo.png"
    );

    return res.status(200).json({ message: "Reply sent successfully", reply });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllContactSupport = async (_req: Request, res: Response) => {
  try {
    const parents = await prisma.contactSupportParent.findMany({
      include: {
        contactSupports: {
          include: {
            contactSupportReplyOwner: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!parents.length) {
      return res
        .status(404)
        .json({ error: "No contact support submissions found" });
    }

    return res.status(200).json({ parents });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMyContactSupport = async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: String(userId) },
      select: { email: true },
    });

    if (!user?.email) {
      return res.status(404).json({ error: "User not found" });
    }

    const parent = await prisma.contactSupportParent.findUnique({
      where: { email: user.email },
      include: {
        contactSupports: {
          include: {
            contactSupportReplyOwner: {
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return res.status(200).json({
      messages: parent?.contactSupports ?? [],
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// Delete a single support message (optional)
export const deleteContactSupport = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.contactSupportReplyOwner.deleteMany({
      where: { contactSupportId: id },
    });
    await prisma.contactSupport.delete({ where: { id } });

    return res
      .status(200)
      .json({ message: "Support message and replies deleted successfully" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
