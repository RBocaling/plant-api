"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiseaseCategory = exports.deleteDisease = exports.updateDisease = exports.createDisease = exports.createCategory = exports.getAllDiseaseCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllDiseaseCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.diseaseCategory.findMany({
            include: { diseases: true },
            orderBy: { id: "asc" },
        });
        const formatted = categories.map((c) => ({
            diseaseTitle: c.diseaseTitle,
            image_url: c.image_url,
            diseasesList: c.diseases.map((d) => ({
                disease: d.disease,
                image: d.image,
                causedBy: d.causedBy,
                mainSymptoms: d.mainSymptoms,
                preventionControl: d.preventionControl,
            })),
        }));
        res.json(formatted);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch disease categories." });
    }
};
exports.getAllDiseaseCategories = getAllDiseaseCategories;
const createCategory = async (req, res) => {
    try {
        const { diseaseTitle, image_url } = req.body;
        const category = await prisma_1.default.diseaseCategory.create({
            data: { diseaseTitle, image_url },
        });
        res.json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createCategory = createCategory;
const createDisease = async (req, res) => {
    try {
        const { disease, image, causedBy, mainSymptoms, preventionControl, categoryId, } = req.body;
        const newDisease = await prisma_1.default.disease.create({
            data: {
                disease,
                image,
                causedBy,
                mainSymptoms,
                preventionControl,
                categoryId,
            },
        });
        res.json(newDisease);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createDisease = createDisease;
const updateDisease = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prisma_1.default.disease.update({
            where: { id: Number(id) },
            data: req.body,
        });
        res.json(updated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateDisease = updateDisease;
const deleteDisease = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await prisma_1.default.disease.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDisease = deleteDisease;
const deleteDiseaseCategory = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const deleteDiseases = await prisma_1.default.disease.deleteMany({
            where: { categoryId: id },
        });
        if (!deleteDiseases) {
            return res.status(400).json({ message: "Failed to delete diseases." });
        }
        await prisma_1.default.diseaseCategory.delete({ where: { id } });
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteDiseaseCategory = deleteDiseaseCategory;
