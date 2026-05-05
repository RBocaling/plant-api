"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeCategory = exports.editCategory = exports.addCategory = exports.getCategory = exports.getCategories = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const category_services_1 = require("../services/category.services");
const uploadDir = path_1.default.join(__dirname, '..', '..', 'assets', 'images');
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        cb(null, Date.now() + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage });
const getCategories = async (_req, res) => {
    try {
        const {} = _req.user?.role;
        const categories = await (0, category_services_1.getAllCategories)();
        if (categories.length === 0) {
            return res.status(404).json({ message: 'No categories found' });
        }
        const categoriesWithFullUrl = categories.map((category) => ({
            ...category,
            imageUrl: `${_req.protocol}://${_req.get('host')}/images/${category.imageUrl}`,
        }));
        res.status(200).json(categoriesWithFullUrl);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategories = getCategories;
const getCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await (0, category_services_1.getCategoryById)(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        category.imageUrl = `${req.protocol}://${req.get('host')}/images/${category.imageUrl}`;
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCategory = getCategory;
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const file = req.file;
        if (!name || !file) {
            return res.status(400).json({ message: 'Name and image file are required' });
        }
        const fileNameOnly = file.filename;
        const newCategory = await (0, category_services_1.createCategory)(name, fileNameOnly);
        res.status(201).json({
            ...newCategory,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${newCategory.imageUrl}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.addCategory = addCategory;
const editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { name } = req.body;
        const file = req.file;
        const imageUrl = file ? file.filename : undefined;
        const updated = await (0, category_services_1.updateCategory)(id, { name, imageUrl });
        res.status(200).json({
            ...updated,
            imageUrl: `${req.protocol}://${req.get('host')}/images/${updated.imageUrl}`,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.editCategory = editCategory;
const removeCategory = async (req, res) => {
    try {
        const id = req.params.id;
        await (0, category_services_1.deleteCategory)(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removeCategory = removeCategory;
