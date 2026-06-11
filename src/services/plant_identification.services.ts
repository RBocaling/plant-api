import { getOpenAIClient } from "../config/openai";
import { PRIORITY_PLANT_NAMES } from "../data/validatedPlants";
import {
  enrichWithValidatedSources,
  findValidatedPlant,
} from "../utils/matchValidatedPlant";

const priorityPlants = PRIORITY_PLANT_NAMES;

export const identifyPlantService = async (imageUrl: string) => {
  try {
    const prompt = `
You are a world-class botanist and plant health expert AI, designed to outperform Plant.id API with higher accuracy.

Analyze the attached plant image and return ONLY a strict JSON object (no extra commentary).

### Rules:
1. Cross-check leaf shape, flower morphology, stem, and growth habit to ensure accuracy.
2. Provide only ONE final most confident result (not multiple).
3. Always include:
   - "plant_name": common name
   - "species": scientific name
   - "description": detailed description
   - "demand_philippines": explanation string (not boolean)
   - "scan_confidence": integer 0–100
   - "identified_disease": array
   - "health_status": integer 0–100 (use scale below)
   - "health_category": string (from Health Category Standard)
   - "healthy": true/false
   - "care_instructions": array of prescriptive, step-by-step instructions
   - "isOriginal": true/false (true if real/natural living plant, false if plastic/artificial/fake)
   - "authenticity_confidence": integer 0–100 (how confident you are that the plant is real, based on texture, color, and leaf veins)
   - "summary": string (overall spoken summary for frontend voice assistant)

### Health Category Standard:
- 100% → "Perfect: No signs of spots or damage on the plant"
- 90–99% → "Good: Minor spots but not very noticeable"
- 80–89% → "Fair: Visible issues present on the plant"
- 50–79% → "Poor: Plant is heavily damaged and nearly wilted"
- Below 50% → "Critical: Plant is at risk of dying"

### Determining Original vs Plastic:
- Real plants have natural vein structures, uneven growth, possible imperfections, or minor discolorations.
- Plastic/fake plants usually have overly shiny, waxy, or perfectly symmetrical leaves without natural veins.
- Estimate an "authenticity_confidence" score:
  - 90–100 → definitely real
  - 70–89 → likely real
  - 50–69 → uncertain or mixed materials
  - below 50 → likely plastic/fake
- If authenticity_confidence < 50, set "isOriginal": false.

### Confidence handling:
- If "scan_confidence" < 70:
  Detect what the uploaded image likely is (e.g., human, animal, object, blurry, food, etc.).
  Then return ONLY this JSON:
  {
    "errorMessage": "Oops! We couldn’t identify the plant. Please retake the photo and ensure the plant is clearly visible.",
    "because": "Your scan looks more like [object/human/animal/blurry/etc.] instead of a plant.",
    "summary": "Welcome user. Unfortunately, we couldn’t identify your plant because the image looks more like [object/human/animal/blurry/etc.]. Please try retaking a clearer photo."
  }

### Special Note:
- If plant is in priority list [${priorityPlants.join(", ")}], add:
  "special_note": "This plant is one of Mariecar's shop plants. If you want to buy, visit her shop."

### Summary guidance (for successful scans):
- Start with "Welcome user, this is the result of your scan."
- State the identified plant name and description.
- Include demand_philippines as an explanation.
- If special_note exists, mention it.
- Briefly explain its health status and how to care for it.
- State if it is original or plastic, and mention authenticity_confidence.
- End with: "{{plant_name}}, this scan is {{scan_confidence}}% confident. To be sure, you may also search this plant on Google."
`;

    const response = await getOpenAIClient().chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: imageUrl } },
          ],
        },
      ],
      max_tokens: 900,
    });

    const aiText = response.choices[0].message.content as string;
    const cleaned = aiText.replace(/```(json)?/g, "").trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No valid JSON found in AI response");

    const parsed = JSON.parse(jsonMatch[0]);

    // ✅ Normalize scan_confidence
    if (typeof parsed.scan_confidence === "number") {
      parsed.scan_confidence = Math.min(
        100,
        Math.max(0, parsed.scan_confidence)
      );
    }

    // ✅ Handle low-confidence scans
    if (parsed.scan_confidence && parsed.scan_confidence < 70) {
      return {
        errorMessage:
          parsed.errorMessage ||
          "Oops! We couldn’t identify the plant. Please retake the photo and ensure the plant is clearly visible.",
        because: parsed.because || "Your scan is not a plant.",
        summary:
          parsed.summary ||
          "Welcome user. Unfortunately, we couldn’t identify your plant because the image is unclear or not a plant. Please try retaking a clearer photo.",
      };
    }

    // ✅ Normalize authenticity_confidence
    if (typeof parsed.authenticity_confidence === "number") {
      parsed.authenticity_confidence = Math.min(
        100,
        Math.max(0, parsed.authenticity_confidence)
      );
      parsed.isOriginal = parsed.authenticity_confidence >= 50;
    } else {
      parsed.authenticity_confidence = parsed.isOriginal ? 95 : 30;
    }

    // ✅ Map health status to category
    if (typeof parsed.health_status === "number") {
      if (parsed.health_status === 100) {
        parsed.health_category =
          "Perfect: No signs of spots or damage on the plant";
      } else if (parsed.health_status >= 90) {
        parsed.health_category = "Good: Minor spots but not very noticeable";
      } else if (parsed.health_status >= 80) {
        parsed.health_category = "Fair: Visible issues present on the plant";
      } else if (parsed.health_status >= 50) {
        parsed.health_category =
          "Poor: Plant is heavily damaged and nearly wilted";
      } else {
        parsed.health_category = "Critical: Plant is at risk of dying";
      }
    }

    const validatedPlant = findValidatedPlant(parsed.plant_name);
    if (validatedPlant) {
      return enrichWithValidatedSources(parsed, validatedPlant);
    }

    return {
      ...parsed,
      has_local_sources: false,
    };
  } catch (error: any) {
    throw new Error(`OpenAI API error: ${error.message}`);
  }
};

export const getValidatedPlantsService = () => {
  return PRIORITY_PLANT_NAMES;
};
