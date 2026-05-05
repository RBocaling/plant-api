import { Request, Response } from "express";
import { sendEmail } from "../utils/email";
import prisma from "../config/prisma";

export const insertContactSupport = async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  try {
    let parent = await prisma.contactSupportParent.findUnique({
      where: { email },
    });
    if (!parent) {
      parent = await prisma.contactSupportParent.create({ data: { email } });
    }

    const contact = await prisma.contactSupport.create({
      data: {
        name,
        subject,
        message,
        parentId: parent.id,
      },
      include: { contactSupportReplyOwner: true },
    });

    return res.status(200).json({
      message: "Support request submitted successfully",
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
