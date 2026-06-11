"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getAllCategories = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getAllCategories = async () => {
    try {
        return await prisma_1.default.plantCategory.findMany();
    }
    catch (error) {
        throw new Error('Failed to fetch categories');
    }
};
exports.getAllCategories = getAllCategories;
const getCategoryById = async (id) => {
    try {
        return await prisma_1.default.plantCategory.findUnique({ where: { id } });
    }
    catch (error) {
        throw new Error('Failed to fetch category');
    }
};
exports.getCategoryById = getCategoryById;
const createCategory = async (name, imageFileName) => {
    try {
        return await prisma_1.default.plantCategory.create({
            data: { name, imageUrl: imageFileName },
        });
    }
    catch (error) {
        throw new Error('Failed to create category');
    }
};
exports.createCategory = createCategory;
const updateCategory = async (id, data) => {
    try {
        return await prisma_1.default.plantCategory.update({
            where: { id },
            data,
        });
    }
    catch (error) {
        throw new Error('Failed to update category');
    }
};
exports.updateCategory = updateCategory;
const deleteCategory = async (id) => {
    try {
        return await prisma_1.default.plantCategory.delete({ where: { id } });
    }
    catch (error) {
        throw new Error('Failed to delete category');
    }
};
exports.deleteCategory = deleteCategory;
