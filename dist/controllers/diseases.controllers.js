"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteDiseaseCategory = exports.deleteDisease = exports.updateDisease = exports.createDisease = exports.createCategory = exports.getCategoryAdmin = exports.getDiseasesAdmin = exports.getAllDiseaseCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const pickDiseaseFields = (body) => ({
    disease: body.disease,
    image: typeof body.image === "string" && body.image.startsWith("data:")
        ? undefined
        : body.image,
    causedBy: body.causedBy,
    mainSymptoms: body.mainSymptoms,
    preventionControl: body.preventionControl ?? body.preventionAndControl,
    categoryId: body.categoryId,
});
const getAllDiseaseCategories = async (req, res) => {
    try {
        const categories = await prisma_1.default.diseaseCategory.findMany({
            include: { diseases: true },
            orderBy: { id: "asc" },
        });
        const formatted = categories.map((c) => ({
            id: c?.id,
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
const getDiseasesAdmin = async (req, res) => {
    try {
        const category = await prisma_1.default.disease.findMany({
            include: {
                category: true,
            },
        });
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getDiseasesAdmin = getDiseasesAdmin;
const getCategoryAdmin = async (_req, res) => {
    try {
        let category = await prisma_1.default.diseaseCategory.findMany({
            orderBy: { createdAt: "asc" },
        });
        if (!category.length) {
            const defaults = [
                { diseaseTitle: "Fungal Diseases", image_url: "" },
                { diseaseTitle: "Bacterial Diseases", image_url: "" },
                { diseaseTitle: "Viral Diseases", image_url: "" },
                { diseaseTitle: "Specialized / Rare Diseases", image_url: "" },
            ];
            await prisma_1.default.diseaseCategory.createMany({ data: defaults });
            category = await prisma_1.default.diseaseCategory.findMany({
                orderBy: { createdAt: "asc" },
            });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategoryAdmin = getCategoryAdmin;
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
        const data = pickDiseaseFields(req.body);
        if (!data.disease || !data.image || !data.categoryId) {
            return res.status(400).json({ message: "Missing required disease fields." });
        }
        const newDisease = await prisma_1.default.disease.create({
            data: data,
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
        const data = pickDiseaseFields(req.body);
        const payload = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));
        if (!Object.keys(payload).length) {
            return res.status(400).json({ message: "No valid fields to update." });
        }
        const updated = await prisma_1.default.disease.update({
            where: { id },
            data: payload,
        });
        res.json(updated);
    }
    catch (error) {
        if (error?.code === "P2025") {
            return res.status(404).json({ message: "Disease not found." });
        }
        res.status(500).json({ message: error.message });
    }
};
exports.updateDisease = updateDisease;
const deleteDisease = async (req, res) => {
    try {
        const id = req.params.id;
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
        const id = req.params.id;
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
