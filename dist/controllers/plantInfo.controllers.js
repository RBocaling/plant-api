"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeGalleryImage = exports.removePlant = exports.editPlant = exports.addPlant = exports.getPlant = exports.getPlants = exports.uploadPlantImages = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const plantInfo_services_1 = require("../services/plantInfo.services");
const plantInfo_services_2 = require("../services/plantInfo.services");
const prisma_1 = __importDefault(require("../config/prisma"));
const uploadDir = path_1.default.join(__dirname, '..', '..', 'uploads');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
const isValidImage = (file) => {
    return file.mimetype.startsWith('image/');
};
exports.uploadPlantImages = (0, multer_1.default)({ storage });
const getPlants = async (_req, res) => {
    try {
        const plants = await (0, plantInfo_services_1.getAllPlantInfo)();
        if (!plants || plants.length === 0) {
            return res.status(404).json({ message: 'No plants found' });
        }
        res.status(200).json(plants);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPlants = getPlants;
const getPlant = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const plant = await (0, plantInfo_services_1.getPlantInfoById)(id);
        if (!plant) {
            return res.status(404).json({ message: 'Plant not found' });
        }
        res.status(200).json(plant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPlant = getPlant;
const addPlant = async (req, res) => {
    try {
        if (!req.body)
            return res.status(400).json({ message: 'Missing form data.' });
        const { name, scientificName, genus, description, categoryId, price, watering, fertilizing, note, harvesting } = req.body;
        const files = req.files;
        if (!name || !scientificName || !genus || !description || !categoryId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const mainImageFile = files?.image?.[0];
        if (mainImageFile && !isValidImage(mainImageFile)) {
            return res.status(400).json({ message: 'Main image must be a valid image file.' });
        }
        for (const file of files?.galleryImages || []) {
            if (!isValidImage(file)) {
                return res.status(400).json({ message: 'All gallery images must be valid image files.' });
            }
        }
        const imageUrl = mainImageFile?.filename ?? null;
        const galleryImages = (files.galleryImages || []).map((file) => ({
            url: file.filename,
        }));
        const newPlant = await (0, plantInfo_services_1.createPlantInfo)({
            name,
            scientificName,
            genus,
            imageUrl: imageUrl || '',
            description,
            price: price || '',
            watering: watering || '',
            fertilizing: fertilizing || '',
            note: note || '',
            harvesting: harvesting || '',
            categoryId: parseInt(categoryId),
            galleryImages,
        });
        const fullPlant = await (0, plantInfo_services_1.getPlantInfoById)(newPlant.id);
        res.status(201).json(fullPlant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addPlant = addPlant;
const editPlant = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { name, scientificName, genus, description, watering, fertilizing, note, harvesting, price, categoryId, } = req.body;
        const files = req.files;
        const updateData = {
            name,
            scientificName,
            genus,
            description,
            watering,
            fertilizing,
            note,
            harvesting,
            price,
        };
        const mainImageFile = files?.image?.[0];
        if (mainImageFile && !isValidImage(mainImageFile)) {
            return res.status(400).json({ message: 'Main image must be a valid image file.' });
        }
        for (const file of files?.galleryImages || []) {
            if (!isValidImage(file)) {
                return res.status(400).json({ message: 'All gallery images must be valid image files.' });
            }
        }
        if (mainImageFile) {
            updateData.imageUrl = mainImageFile.filename;
        }
        if (categoryId) {
            updateData.categoryId = parseInt(categoryId);
        }
        const updated = await (0, plantInfo_services_1.updatePlantInfo)(id, updateData);
        if (files?.galleryImages && files.galleryImages.length > 0) {
            const galleryData = files.galleryImages.map((file) => ({
                imageUrl: file.filename,
                plantId: id,
            }));
            await prisma_1.default.plantGallery.createMany({ data: galleryData });
        }
        const fullPlant = await (0, plantInfo_services_1.getPlantInfoById)(updated.id);
        res.status(200).json(fullPlant);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.editPlant = editPlant;
const removePlant = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        await (0, plantInfo_services_1.deletePlantInfo)(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removePlant = removePlant;
const removeGalleryImage = async (req, res) => {
    try {
        const id = parseInt(req.params.imageId);
        await (0, plantInfo_services_2.deleteGalleryImage)(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removeGalleryImage = removeGalleryImage;
