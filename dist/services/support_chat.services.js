"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportConcernByIdAdmin = exports.fetchAllSupportConcerns = exports.updateResponse = exports.submitSupportConcern = void 0;
const client_1 = require("@prisma/client");
const email_1 = require("../utils/email");
const ai_support_chat_services_1 = require("./ai_support_chat.services");
const supportValidation_1 = require("../utils/supportValidation");
const prisma = new client_1.PrismaClient();
const submitSupportConcern = async ({ concern_msg, image, customer_id, urgency = "MEDIUM", generateInitialAiReply = false, }) => {
    try {
        const customerId = customer_id?.toString();
        if (!customerId) {
            throw new Error("Customer ID is required.");
        }
        const expectedResponseHours = (0, supportValidation_1.getExpectedResponseHours)(urgency);
        let aiGeneratedReply = null;
        if (generateInitialAiReply) {
            try {
                aiGeneratedReply = await (0, ai_support_chat_services_1.generateAISupportReply)(concern_msg, customerId);
            }
            catch (error) {
                console.error("AI initial support reply generation failed.");
            }
        }
        const createData = {
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
    }
    catch (error) {
        console.error("Support creation failed.");
        throw new Error("Error creating support entry");
    }
};
exports.submitSupportConcern = submitSupportConcern;
const updateResponse = async (supportId, response) => {
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
    email_1.transporter.sendMail({
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
exports.updateResponse = updateResponse;
const fetchAllSupportConcerns = async () => {
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
    }
    catch (error) {
        console.error('Service Error - fetchAllSupportConcerns :', error);
        throw new Error('Failed to retrieve all support concerns');
    }
};
exports.fetchAllSupportConcerns = fetchAllSupportConcerns;
const getSupportConcernByIdAdmin = async (id) => {
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
    }
    catch (error) {
        console.error('Service Error - getSupportConcernByIdAdmin:', error);
        throw new Error('Failed to retrieve support concern by ID');
    }
};
exports.getSupportConcernByIdAdmin = getSupportConcernByIdAdmin;
