import { Request, Response } from "express";
import { identifyPlantService } from "../services/plant_identification.services";
import prisma from "../config/prisma";
import { generateOtp } from "../utils/generateOtp";

export const identifyPlant = async (req: Request, res: Response) => {
  const { img_url } = req.body;

  if (!img_url) {
    throw new Error("plant can't find, please try again!");
  }
  const userId = Number(req.user?.id);
  try {
    const result = await identifyPlantService(img_url);
    const {
      plant_name,
      species,
      description,
      demand_philippines,
      scan_confidence,
      identified_disease,
      health_status,
      health_category,
      healthy,
      care_instructions,
      isOriginal,
      special_note,
      summary,
      authenticity_confidence,
    } = result;
    await prisma.history.create({
      data: {
        plant_id: generateOtp(10)?.toString(),
        plant_name,
        img_url,
        species,
        description,
        demand_philippines,
        scan_confidence,
        identified_disease,
        health_status,
        health_category,
        healthy,
        care_instructions,
        isOriginal,
        special_note,
        summary,
        authenticity_confidence: authenticity_confidence?.toString(),
        userId,
      },
    });

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
