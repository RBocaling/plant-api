import { VALIDATED_PLANTS, ValidatedPlant } from "../data/validatedPlants";

const normalize = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/\s+/g, " ");

const getMatchNames = (plant: ValidatedPlant) =>
  Array.from(
    new Set([plant.primaryName, ...plant.commonNames, ...plant.aliases].map(normalize))
  );

export const findValidatedPlant = (inputName?: string): ValidatedPlant | null => {
  if (!inputName?.trim()) return null;

  const query = normalize(inputName);
  let bestMatch: { plant: ValidatedPlant; score: number } | null = null;

  for (const plant of VALIDATED_PLANTS) {
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

export const enrichWithValidatedSources = (
  aiResponse: Record<string, any>,
  plant: ValidatedPlant
) => {
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
    special_note:
      aiResponse.special_note ||
      "This plant is one of Rosemar Garden's shop plants. Information below is validated from Philippine academic and institutional sources.",
  };
};
