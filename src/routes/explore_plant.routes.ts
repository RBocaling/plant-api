import { Router } from "express";
import { addPlant, editPlant, getPlants, removePlant } from "../controllers/explore_plant.controllers";

const router = Router();

router.post("/", addPlant as any);
router.get("/", getPlants as any);
router.put("/:id", editPlant as any);
router.delete("/:id", removePlant as any);

export default router;

