"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyPlant = void 0;
const plant_identification_services_1 = require("../services/plant_identification.services");
const prisma_1 = __importDefault(require("../config/prisma"));
const generateOtp_1 = require("../utils/generateOtp");
const identifyPlant = async (req, res) => {
    const { img_url } = req.body;
    if (!img_url) {
        throw new Error("plant can't find, please try again!");
    }
    const userId = req.user?.id;
    try {
        const result = await (0, plant_identification_services_1.identifyPlantService)(img_url);
        const { plant_name, species, description, demand_philippines, scan_confidence, identified_disease, health_status, health_category, healthy, care_instructions, isOriginal, special_note, summary, authenticity_confidence, } = result;
        await prisma_1.default.history.create({
            data: {
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
            },
        });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.identifyPlant = identifyPlant;
