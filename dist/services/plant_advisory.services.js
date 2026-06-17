"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePlantAdvisoryPriority = exports.updatePlantAdvisoryStatus = exports.getPlantAdvisoryById = exports.fetchAllPlantAdvisories = exports.fetchCustomerPlantAdvisories = exports.makeResponse = exports.submitPlantAdvisory = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const submitPlantAdvisory = async (plant_name, request_type, status, priority, customer_id) => {
    try {
        const advisory = await prisma_1.default.plantAdvisory.create({
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
    const advisory = await prisma_1.default.plantAdvisory.findUnique({
        where: { id },
    });
    if (!advisory) {
        throw new Error(`Advisory with ID ${id} not found`);
    }
    try {
        const updated = await prisma_1.default.plantAdvisory.update({
            where: { id },
            data: { response, status: "RESOLVED" },
        });
        return updated;
    }
    catch (error) {
        console.error("Service Error - makeResponse:", error);
        throw new Error("Failed to make advisory response");
    }
};
exports.makeResponse = makeResponse;
const fetchCustomerPlantAdvisories = async (customerId) => {
    try {
        return await prisma_1.default.plantAdvisory.findMany({
            where: { userId: customerId },
            orderBy: { createdAt: "desc" },
        });
    }
    catch (error) {
        console.error("Service Error - fetchCustomerPlantAdvisories:", error);
        throw new Error("Failed to retrieve your plant advisories");
    }
};
exports.fetchCustomerPlantAdvisories = fetchCustomerPlantAdvisories;
const fetchAllPlantAdvisories = async () => {
    try {
        return await prisma_1.default.plantAdvisory.findMany({
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
        return await prisma_1.default.plantAdvisory.findUnique({
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
    const advisory = await prisma_1.default.plantAdvisory.findUnique({
        where: { id },
    });
    if (!advisory) {
        throw new Error(`Plant advisory with ID ${id} not found`);
    }
    try {
        return await prisma_1.default.plantAdvisory.update({
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
    const advisory = await prisma_1.default.plantAdvisory.findUnique({
        where: { id },
    });
    if (!advisory) {
        throw new Error(`Plant advisory with ID ${id} not found`);
    }
    try {
        const data = await prisma_1.default.plantAdvisory.update({
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
