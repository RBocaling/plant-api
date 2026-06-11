"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlantAdvisoryPriority = exports.updatePlantAdvisoryStatus = exports.getPlantAdvisoryById = exports.fetchAllPlantAdvisories = exports.makeResponse = exports.submitPlantAdvisory = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const submitPlantAdvisory = async (plant_name, request_type, status, priority, customer_id) => {
    try {
        const advisory = await prisma.plantAdvisory.create({
            data: {
                plant_name,
                request_type,
                status,
                priority,
                userId: customer_id,
            },
        });
        return advisory;
    }
    catch (error) {
        console.error('Service Error - submitPlantAdvisory:', error);
        throw new Error('Error creating plant advisory');
    }
};
exports.submitPlantAdvisory = submitPlantAdvisory;
const makeResponse = async (id, response) => {
    const feedback = await prisma.feedback.findUnique({
        where: { id },
    });
    if (!feedback) {
        throw new Error(`Advisory with ID ${id} not found`);
    }
    try {
        const updated = await prisma.plantAdvisory.update({
            where: { id },
            data: { response, status: 'RESOLVED', },
        });
        return updated;
    }
    catch (error) {
        console.error('Service Error - makeResponse:', error);
        throw new Error('Failed to to make advisory');
    }
};
exports.makeResponse = makeResponse;
const fetchAllPlantAdvisories = async () => {
    try {
        return await prisma.plantAdvisory.findMany({
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
        console.error('Service Error - fetchAllPlantAdvisories:', error);
        throw new Error('Failed to retrieve plant advisories');
    }
};
exports.fetchAllPlantAdvisories = fetchAllPlantAdvisories;
const getPlantAdvisoryById = async (id) => {
    try {
        return await prisma.plantAdvisory.findUnique({
            where: { id },
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
        console.error('Service Error - getPlantAdvisoryById:', error);
        throw new Error('Failed to retrieve plant advisory by ID');
    }
};
exports.getPlantAdvisoryById = getPlantAdvisoryById;
const updatePlantAdvisoryStatus = async (id, status) => {
    const advisory = await prisma.plantAdvisory.findUnique({
        where: { id },
    });
    if (!advisory) {
        throw new Error(`Plant advisory with ID ${id} not found`);
    }
    try {
        return await prisma.plantAdvisory.update({
            where: { id },
            data: { status },
        });
    }
    catch (error) {
        console.error('Service Error - updatePlantAdvisoryStatus:', error);
        throw new Error('Failed to update status');
    }
};
exports.updatePlantAdvisoryStatus = updatePlantAdvisoryStatus;
const updatePlantAdvisoryPriority = async (id, priority) => {
    const advisory = await prisma.plantAdvisory.findUnique({
        where: { id },
    });
    if (!advisory) {
        throw new Error(`Plant advisory with ID ${id} not found`);
    }
    try {
        const data = await prisma.plantAdvisory.update({
            where: { id },
            data: { priority },
        });
        return data;
    }
    catch (error) {
        console.error('Service Error - updatePlantAdvisoryPriority:', error);
        throw new Error('Failed to update priority');
    }
};
exports.updatePlantAdvisoryPriority = updatePlantAdvisoryPriority;
