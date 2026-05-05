"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removePlant = exports.editPlant = exports.addPlant = exports.getPlant = exports.getPlants = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// ✅ Get all plants (with sizes)
const getPlants = async (_req, res) => {
    try {
        const plants = await prisma.explorePlant.findMany({
            include: { plantSizes: true },
        });
        if (plants.length === 0) {
            return res.status(404).json({ message: "No plants found" });
        }
        res.status(200).json(plants);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPlants = getPlants;
// ✅ Get plant by ID
const getPlant = async (req, res) => {
    try {
        const id = req.params.id;
        const plant = await prisma.explorePlant.findUnique({
            where: { id },
            include: { plantSizes: true },
        });
        if (!plant) {
            return res.status(404).json({ message: "Plant not found" });
        }
        res.status(200).json(plant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPlant = getPlant;
// ✅ Add new plant
const addPlant = async (req, res) => {
    try {
        const { commonName, scientificName, description, funFact, ims_url, plantSizes, type } = req.body;
        if (!commonName ||
            !scientificName ||
            !description ||
            !funFact ||
            !ims_url ||
            !type) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newPlant = await prisma.explorePlant.create({
            data: {
                commonName,
                scientificName,
                description,
                funFact,
                ims_url,
                type,
                plantSizes: plantSizes
                    ? {
                        create: plantSizes,
                    }
                    : undefined,
            },
            include: { plantSizes: true },
        });
        res.status(201).json(newPlant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addPlant = addPlant;
// ✅ Update plant
const editPlant = async (req, res) => {
    try {
        const id = req.params.id;
        const { commonName, scientificName, description, funFact, ims_url, plantSizes, type, } = req.body;
        const updatedPlant = await prisma.explorePlant.update({
            where: { id },
            data: {
                commonName,
                scientificName,
                description,
                funFact,
                ims_url,
                type,
                plantSizes: plantSizes
                    ? {
                        upsert: plantSizes.map((size) => ({
                            where: { id: size.id ?? 0 }, // if no id, will create
                            update: { size: size.size, price: size.price },
                            create: { size: size.size, price: size.price },
                        })),
                    }
                    : undefined,
            },
            include: { plantSizes: true },
        });
        res.status(200).json(updatedPlant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.editPlant = editPlant;
const removePlant = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteSize = await prisma.plantSizes.deleteMany({
            where: {
                explorePlantId: id,
            },
        });
        if (!deleteSize) {
            return res.status(400).json({ message: "Delete Plant failed" });
        }
        await prisma.explorePlant.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removePlant = removePlant;
