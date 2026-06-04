import { Request, Response } from "express";
import {
  getValidatedPlantsService,
  identifyPlantService,
} from "../services/plant_identification.services";
import { VALIDATED_PLANTS } from "../data/validatedPlants";
import prisma from "../config/prisma";
import { generateOtp } from "../utils/generateOtp";

const saveScanHistory = async (
  userId: string | undefined,
  result: Record<string, any>
) => {
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
    validated_info,
    has_local_sources,
    img_url,
  } = result;

  const baseHistory = {
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
    userId: userId?.toString(),
  };

  try {
    await prisma.history.create({
      data: {
        ...baseHistory,
        validated_info: validated_info ?? null,
        has_local_sources: Boolean(has_local_sources),
      } as any,
    });
  } catch (error) {
    console.error(
      "Failed to save scan history with validated fields, retrying legacy shape:",
      error
    );
    await prisma.history.create({
      data: baseHistory as any,
    });
  }
};

export const identifyPlant = async (req: Request, res: Response) => {
  const { img_url } = req.body;

  if (!img_url) {
    throw new Error("plant can't find, please try again!");
  }
  const userId = req.user?.id;
  try {
    const result = await identifyPlantService(img_url);

    if (result.errorMessage) {
      return res.status(200).json(result);
    }

    try {
      await saveScanHistory(userId?.toString(), { ...result, img_url });
    } catch (historyError) {
      console.error("Failed to save scan history:", historyError);
    }

    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getValidatedPlants = async (_req: Request, res: Response) => {
  try {
    res.status(200).json({
      count: VALIDATED_PLANTS.length,
      plants: VALIDATED_PLANTS,
      priorityNames: getValidatedPlantsService(),
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
