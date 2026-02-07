import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  getAllPlantInfo,
  getPlantInfoById,
  createPlantInfo,
  updatePlantInfo,
  deletePlantInfo,
} from '../services/plantInfo.services';

import { deleteGalleryImage } from '../services/plantInfo.services';

import prisma from '../config/prisma'; 


const uploadDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const isValidImage = (file: Express.Multer.File) => {
  return file.mimetype.startsWith('image/');
};

export const uploadPlantImages = multer({ storage });

export const getPlants = async (_req: Request, res: Response) => {
    try {
      const plants = await getAllPlantInfo();
  
      if (!plants || plants.length === 0) {
        return res.status(404).json({ message: 'No plants found' });
      }
  
      res.status(200).json(plants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
  

export const getPlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const plant = await getPlantInfoById(id);

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found' });
    }

    res.status(200).json(plant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addPlant = async (req: Request, res: Response) => {
  try {
     if (!req.body) return res.status(400).json({ message: 'Missing form data.' });
     
    const {
      name,
      scientificName,
      genus,
      description,
      categoryId,
      price,
      watering,
      fertilizing,
      note,
      harvesting
    } = req.body;

    const files = req.files as {
      image?: Express.Multer.File[];
      galleryImages?: Express.Multer.File[];
    };

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

    const newPlant = await createPlantInfo({
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

    const fullPlant = await getPlantInfoById(newPlant.id);
    res.status(201).json(fullPlant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const editPlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const {
      name,
      scientificName,
      genus,
      description,
      watering,
      fertilizing,
      note,
      harvesting,
      price,
      categoryId,
    } = req.body;

    const files = req.files as {
      image?: Express.Multer.File[];
      galleryImages?: Express.Multer.File[];
    };

    const updateData: any = {
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

    const updated = await updatePlantInfo(id, updateData);

    if (files?.galleryImages && files.galleryImages.length > 0) {
      const galleryData = files.galleryImages.map((file) => ({
        imageUrl: file.filename,
        plantId: id,
      }));

      await prisma.plantGallery.createMany({ data: galleryData });
    }

    const fullPlant = await getPlantInfoById(updated.id);
    res.status(200).json(fullPlant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const removePlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await deletePlantInfo(id);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeGalleryImage = async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.imageId);
      await deleteGalleryImage(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };