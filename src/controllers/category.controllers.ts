import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.services';

const uploadDir = path.join(__dirname, '..', '..', 'assets', 'images');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

export const getCategories = async (_req: Request, res: Response) => {
  try {
    const {} = (_req as any).user?.role
    const categories = await getAllCategories();

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found' });
    }

    const categoriesWithFullUrl = categories.map((category) => ({
      ...category,
      imageUrl: `${_req.protocol}://${_req.get('host')}/images/${category.imageUrl}`,
    }));

    res.status(200).json(categoriesWithFullUrl);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.imageUrl = `${req.protocol}://${req.get('host')}/images/${category.imageUrl}`;

    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: 'Name and image file are required' });
    }

    const fileNameOnly = file.filename;
    const newCategory = await createCategory(name, fileNameOnly);

    res.status(201).json({
      ...newCategory,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${newCategory.imageUrl}`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const editCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    const file = req.file;

    const imageUrl = file ? file.filename : undefined;

    const updated = await updateCategory(id, { name, imageUrl });

    res.status(200).json({
      ...updated,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${updated.imageUrl}`,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeCategory = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deleteCategory(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
