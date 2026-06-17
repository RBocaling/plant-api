import { Request, Response } from "express";
import prisma from "../config/prisma";

export const getAllDiseaseCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.diseaseCategory.findMany({
      include: { diseases: true },
      orderBy: { id: "asc" },
    });

      const formatted = categories.map((c:any) => ({
        id: c?.id,
        diseaseTitle: c.diseaseTitle,
        image_url: c.image_url,
        diseasesList: c.diseases.map((d:any) => ({
          disease: d.disease,
          image: d.image,
          causedBy: d.causedBy,
          mainSymptoms: d.mainSymptoms,
          preventionControl: d.preventionControl,
        })),
      }));

    res.json(formatted);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch disease categories." });
  }
};



export const getDiseasesAdmin = async (req: Request, res: Response) => {
  try {
      const category = await prisma.disease.findMany({
        include: {
          category: true,
        },
      });
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
export const getCategoryAdmin = async (_req: Request, res: Response) => {
  try {
    let category = await prisma.diseaseCategory.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (!category.length) {
      const defaults = [
        { diseaseTitle: "Fungal Diseases", image_url: "" },
        { diseaseTitle: "Bacterial Diseases", image_url: "" },
        { diseaseTitle: "Viral Diseases", image_url: "" },
        { diseaseTitle: "Specialized / Rare Diseases", image_url: "" },
      ];

      await prisma.diseaseCategory.createMany({ data: defaults });
      category = await prisma.diseaseCategory.findMany({
        orderBy: { createdAt: "asc" },
      });
    }

    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { diseaseTitle, image_url } = req.body;
    const category = await prisma.diseaseCategory.create({
      data: { diseaseTitle, image_url },
    });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const createDisease = async (req: Request, res: Response) => {
  try {
    const {
      disease,
      image,
      causedBy,
      mainSymptoms,
      preventionControl,
      categoryId,
    } = req.body;
    const newDisease = await prisma.disease.create({
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateDisease = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await prisma.disease.update({
      where: { id },
      data: req.body,
    });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteDisease = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.disease.delete({ where: { id } });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const deleteDiseaseCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const deleteDiseases = await prisma.disease.deleteMany({
      where: { categoryId: id },
    });

    if (!deleteDiseases) {
      return res.status(400).json({ message: "Failed to delete diseases." });
    }

    await prisma.diseaseCategory.delete({ where: { id } });

    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
