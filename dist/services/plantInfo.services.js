"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGalleryImage = exports.deletePlantInfo = exports.updatePlantInfo = exports.createPlantInfo = exports.getPlantInfoById = exports.getAllPlantInfo = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllPlantInfo = async () => {
    try {
        return await prisma_1.default.plantInfo.findMany({
            where: {
                archived: false,
            },
            include: {
                category: true,
                galleryImages: true,
            },
        });
    }
    catch (error) {
        throw new Error('Failed to fetch plant info.');
    }
};
exports.getAllPlantInfo = getAllPlantInfo;
const getPlantInfoById = async (id) => {
    try {
        return await prisma_1.default.plantInfo.findUnique({
            where: { id },
            include: {
                category: true,
                galleryImages: true,
            },
        });
    }
    catch (error) {
        throw new Error('Failed to fetch plant info.');
    }
};
exports.getPlantInfoById = getPlantInfoById;
const createPlantInfo = async (data) => {
    try {
        console.log('Creating PlantInfo with data:', data);
        const category = await prisma_1.default.plantCategory.findUnique({
            where: { id: data.categoryId },
        });
        if (!category) {
            throw new Error(`Category with ID ${data.categoryId} does not exist.`);
        }
        return await prisma_1.default.plantInfo.create({
            data: {
                name: data.name,
                scientificName: data.scientificName,
                genus: data.genus,
                imageUrl: data.imageUrl,
                description: data.description,
                price: data.price,
                watering: data.watering,
                fertilizing: data.fertilizing,
                note: data.note,
                harvesting: data.harvesting,
                category: {
                    connect: { id: data.categoryId },
                },
                galleryImages: {
                    create: data.galleryImages.map((img) => ({
                        imageUrl: img.url,
                    })),
                },
            },
            include: {
                category: true,
                galleryImages: true,
            },
        });
    }
    catch (error) {
        throw new Error('Failed to create plant info.');
    }
};
exports.createPlantInfo = createPlantInfo;
const updatePlantInfo = async (id, data) => {
    try {
        return await prisma_1.default.plantInfo.update({
            where: { id },
            data,
        });
    }
    catch (error) {
        throw new Error('Failed to update plant info.');
    }
};
exports.updatePlantInfo = updatePlantInfo;
const deletePlantInfo = async (id) => {
    try {
        return await prisma_1.default.plantInfo.update({
            where: { id },
            data: { archived: true },
        });
    }
    catch (error) {
        throw new Error('Failed to archive plant info.');
    }
};
exports.deletePlantInfo = deletePlantInfo;
const deleteGalleryImage = async (id) => {
    try {
        return await prisma_1.default.plantGallery.delete({
            where: { id },
        });
    }
    catch (error) {
        throw new Error('Failed to delete gallery image.');
    }
};
exports.deleteGalleryImage = deleteGalleryImage;
