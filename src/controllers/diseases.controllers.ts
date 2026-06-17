import { Request, Response } from "express";
import prisma from "../config/prisma";

const pickDiseaseFields = (body: Record<string, any>) => ({
  disease: body.disease,
  image: typeof body.image === "string" && body.image.startsWith("data:")
    ? undefined
    : body.image,
  causedBy: body.causedBy,
  mainSymptoms: body.mainSymptoms,
  preventionControl: body.preventionControl ?? body.preventionAndControl,
  categoryId: body.categoryId,
});

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
    const data = pickDiseaseFields(req.body);

    if (!data.disease || !data.image || !data.categoryId) {
      return res.status(400).json({ message: "Missing required disease fields." });
    }

    const newDisease = await prisma.disease.create({
      data: data as any,
    });
    res.json(newDisease);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


export const updateDisease = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = pickDiseaseFields(req.body);

    const payload = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== undefined)
    );

    if (!Object.keys(payload).length) {
      return res.status(400).json({ message: "No valid fields to update." });
    }

    const updated = await prisma.disease.update({
      where: { id },
      data: payload,
    });
    res.json(updated);
  } catch (error: any) {
    if (error?.code === "P2025") {
      return res.status(404).json({ message: "Disease not found." });
    }
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
