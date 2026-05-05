import { PrismaClient } from '@prisma/client';
import nodemailer from "nodemailer";
import { transporter } from "../utils/email";
const prisma = new PrismaClient();

interface SupportInput {
  concern_msg: string;
  image: string;
  customer_id: any;
}

export const submitSupportConcern = async ({
  concern_msg,
  image,
  customer_id,
}: SupportInput) => {
  try {
    const support = await prisma.support.create({
      data: {
        concern_msg,
        image,
        customerId: customer_id?.toString(),
        response: "",
      },
    });

    return support;
  } catch (error) {
    console.error("Service Error:", error);
    throw new Error("Error creating support entry");
  }
};

export const updateResponse = async (supportId: any, response: string) => {
  // Fetch support concern with user email
  const support = await prisma.support.findUnique({
    where: { id: supportId },
    include: {
      customer: {
        select: {
          email: true,
          firstName: true,
        },
      },
    },
  });

  if (!support) {
    throw new Error(`Support concern with ID ${supportId} not found`);
  }

  const { email, firstName } = support.customer;


  transporter.sendMail({
    from: `"Plant Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Response to Your Support Concern",
    html: `
      <p>Hi ${firstName},</p>
      <p>Thank you for contacting us. Here is our response to your concern:</p>
      <blockquote>${response}</blockquote>
      <p>Best regards,<br/>Plant Support Team</p>
    `,
  });

  const updated = await prisma.support.update({
    where: { id: supportId },
    data: { response },
  });

  return updated;
};


export const fetchAllSupportConcerns  = async () => {
  try {
    return await prisma.support.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - fetchAllSupportConcerns :', error);
    throw new Error('Failed to retrieve all support concerns');
  }
};

export const getSupportConcernByIdAdmin = async (id: any) => {
  try {
    return await prisma.support.findUnique({
      where: { id },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  } catch (error) {
    console.error('Service Error - getSupportConcernByIdAdmin:', error);
    throw new Error('Failed to retrieve support concern by ID');
  }
};
