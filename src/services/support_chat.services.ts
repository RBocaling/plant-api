import { Prisma, PrismaClient } from '@prisma/client';
import { transporter } from "../utils/email";
import { generateAISupportReply } from "./ai_support_chat.services";
import {
  getExpectedResponseHours,
  SupportUrgencyValue,
} from "../utils/supportValidation";
const prisma = new PrismaClient();

interface SupportInput {
  concern_msg: string;
  image: string;
  customer_id: string | number | undefined;
  urgency?: SupportUrgencyValue;
  generateInitialAiReply?: boolean;
}

export const submitSupportConcern = async ({
  concern_msg,
  image,
  customer_id,
  urgency = "MEDIUM",
  generateInitialAiReply = false,
}: SupportInput) => {
  try {
    const customerId = customer_id?.toString();
    if (!customerId) {
      throw new Error("Customer ID is required.");
    }

    const expectedResponseHours = getExpectedResponseHours(urgency);
    let aiGeneratedReply: string | null = null;

    if (generateInitialAiReply) {
      try {
        aiGeneratedReply = await generateAISupportReply(concern_msg, customerId);
      } catch (error) {
        console.error("AI initial support reply generation failed.");
      }
    }

    const createData: Prisma.SupportUncheckedCreateInput = {
      concern_msg,
      image,
      customerId,
      response: "",
      urgency,
      expectedResponseHours,
      aiGeneratedReply,
    };

    const support = await prisma.support.create({
      data: createData,
    });

    return support;
  } catch (error) {
    console.error("Support creation failed.");
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
