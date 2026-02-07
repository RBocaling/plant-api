import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ✅ Get all plants (with sizes)
export const getPlants = async (_req: Request, res: Response) => {
  try {
    const plants = await prisma.explorePlant.findMany({
      include: { plantSizes: true },
    });

    if (plants.length === 0) {
      return res.status(404).json({ message: "No plants found" });
    }

    res.status(200).json(plants);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get plant by ID
export const getPlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const plant = await prisma.explorePlant.findUnique({
      where: { id },
      include: { plantSizes: true },
    });

    if (!plant) {
      return res.status(404).json({ message: "Plant not found" });
    }

    res.status(200).json(plant);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Add new plant
export const addPlant = async (req: Request, res: Response) => {
  try {
    const {
      commonName,
      scientificName,
      description,
      funFact,
      ims_url,
        plantSizes,
      type
    } = req.body;

    if (
      !commonName ||
      !scientificName ||
      !description ||
      !funFact ||
      !ims_url ||
      !type
    ) {
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update plant
export const editPlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const {
      commonName,
      scientificName,
      description,
      funFact,
      ims_url,
      plantSizes,
      type,
    } = req.body;

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
              upsert: plantSizes.map((size: any) => ({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removePlant = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
