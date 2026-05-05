"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFeedback = exports.getFeedbackById = exports.fetchAllFeedbacks = exports.updateStatus = exports.makeResponse = exports.submitFeedback = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const submitFeedback = async (rating, userId, description) => {
    if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5');
    }
    try {
        const feedback = await prisma.feedback.create({
            data: {
                rating,
                status: client_1.Status.OPEN,
                userId,
                response: '',
                description
            },
        });
        return feedback;
    }
    catch (error) {
        console.error('Service Error - submitFeedback:', error);
        throw new Error('Error creating feedback');
    }
};
exports.submitFeedback = submitFeedback;
const makeResponse = async (id, response) => {
    const feedback = await prisma.feedback.findUnique({
        where: { id },
    });
    if (!feedback) {
        throw new Error(`Feedback with ID ${id} not found`);
    }
    try {
        const updated = await prisma.feedback.update({
            where: { id },
            data: { response },
        });
        return updated;
    }
    catch (error) {
        console.error('Service Error - makeResponse:', error);
        throw new Error('Failed to update feedback response');
    }
};
exports.makeResponse = makeResponse;
const updateStatus = async (id, status) => {
    const update = await prisma.feedback.findUnique({
        where: { id },
    });
    if (!update) {
        throw new Error(`Status with ID ${id} not found`);
    }
    try {
        const updated = await prisma.feedback.update({
            where: { id },
            data: { status },
        });
        return updated;
    }
    catch (error) {
        console.error('Service Error - updateStatus:', error);
        throw new Error('Failed to update feedback status');
    }
};
exports.updateStatus = updateStatus;
const fetchAllFeedbacks = async () => {
    try {
        return await prisma.feedback.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                        createdAt: true,
                    },
                },
            },
        });
    }
    catch (error) {
        console.error('Service Error - fetchAllFeedbacks:', error);
        throw new Error('Failed to retrieve feedbacks');
    }
};
exports.fetchAllFeedbacks = fetchAllFeedbacks;
const getFeedbackById = async (id) => {
    try {
        return await prisma.feedback.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }
    catch (error) {
        console.error('Service Error - getFeedbackById:', error);
        throw new Error('Failed to retrieve feedback by ID');
    }
};
exports.getFeedbackById = getFeedbackById;
const getUserFeedback = async (userId) => {
    try {
        const feedbacks = await prisma.feedback.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return feedbacks;
    }
    catch (error) {
        console.error('Service Error - getUserFeedback:', error);
        throw new Error('Error fetching feedback for user');
    }
};
exports.getUserFeedback = getUserFeedback;
