"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getValidatedPlants = exports.identifyPlant = void 0;
const plant_identification_services_1 = require("../services/plant_identification.services");
const validatedPlants_1 = require("../data/validatedPlants");
const prisma_1 = __importDefault(require("../config/prisma"));
const generateOtp_1 = require("../utils/generateOtp");
const saveScanHistory = async (userId, result) => {
    const { plant_name, species, description, demand_philippines, scan_confidence, identified_disease, health_status, health_category, healthy, care_instructions, isOriginal, special_note, summary, authenticity_confidence, validated_info, has_local_sources, img_url, } = result;
    const baseHistory = {
        plant_id: (0, generateOtp_1.generateOtp)(10)?.toString(),
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
        await prisma_1.default.history.create({
            data: {
                ...baseHistory,
                validated_info: validated_info ?? null,
                has_local_sources: Boolean(has_local_sources),
            },
        });
    }
    catch (error) {
        console.error("Failed to save scan history with validated fields, retrying legacy shape:", error);
        await prisma_1.default.history.create({
            data: baseHistory,
        });
    }
};
const identifyPlant = async (req, res) => {
    const { img_url } = req.body;
    if (!img_url) {
        throw new Error("plant can't find, please try again!");
    }
    const userId = req.user?.id;
    try {
        const result = await (0, plant_identification_services_1.identifyPlantService)(img_url);
        if (result.errorMessage) {
            return res.status(200).json(result);
        }
        try {
            await saveScanHistory(userId?.toString(), { ...result, img_url });
        }
        catch (historyError) {
            console.error("Failed to save scan history:", historyError);
        }
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.identifyPlant = identifyPlant;
const getValidatedPlants = async (_req, res) => {
    try {
        res.status(200).json({
            count: validatedPlants_1.VALIDATED_PLANTS.length,
            plants: validatedPlants_1.VALIDATED_PLANTS,
            priorityNames: (0, plant_identification_services_1.getValidatedPlantsService)(),
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getValidatedPlants = getValidatedPlants;
