"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupportConcernByIdAdmin = exports.fetchAllSupportConcerns = exports.updateResponse = exports.submitSupportConcern = void 0;
const client_1 = require("@prisma/client");
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
const submitSupportConcern = async ({ concern_msg, image, customer_id, }) => {
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
    }
    catch (error) {
        console.error("Service Error:", error);
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
