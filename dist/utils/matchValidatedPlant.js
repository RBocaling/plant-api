"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrichWithValidatedSources = exports.findValidatedPlant = void 0;
const validatedPlants_1 = require("../data/validatedPlants");
const normalize = (value) => value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, " ");
const getMatchNames = (plant) => Array.from(new Set([plant.primaryName, ...plant.commonNames, ...plant.aliases].map(normalize)));
const findValidatedPlant = (inputName) => {
    if (!inputName?.trim())
        return null;
    const query = normalize(inputName);
    let bestMatch = null;
    for (const plant of validatedPlants_1.VALIDATED_PLANTS) {
        for (const name of getMatchNames(plant)) {
            if (query === name) {
                return plant;
            }
            // Prefer when the AI/query string contains the full known plant name.
            if (query.includes(name) && name.length >= 5) {
                const score = name.length;
                if (!bestMatch || score > bestMatch.score) {
                    bestMatch = { plant, score };
                }
            }
        }
    }
    return bestMatch?.plant ?? null;
};
exports.findValidatedPlant = findValidatedPlant;
const enrichWithValidatedSources = (aiResponse, plant) => {
    return {
        ...aiResponse,
        plant_name: plant.primaryName,
        species: plant.scientificName,
        description: plant.physicalDescription,
        demand_philippines: plant.uses,
        // Keep AI-generated care steps for the Health tab (disease treatment, etc.).
        care_instructions: aiResponse.care_instructions,
        has_local_sources: true,
        validated_info: {
            id: plant.id,
            commonNames: plant.commonNames,
            scientificName: plant.scientificName,
            family: plant.family,
            origin: plant.origin,
            physicalDescription: plant.physicalDescription,
            careRequirements: plant.careRequirements,
            uses: plant.uses,
            notes: plant.notes,
            citations: plant.citations,
        },
        special_note: aiResponse.special_note ||
            "This plant is one of Rosemar Garden's shop plants. Information below is validated from Philippine academic and institutional sources.",
    };
};
exports.enrichWithValidatedSources = enrichWithValidatedSources;
