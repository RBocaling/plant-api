import { Router } from "express";
import {
  getValidatedPlants,
  identifyPlant,
} from "../controllers/plant_identification.controllers";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/validated-plants", getValidatedPlants as any);
router.post("/identify", authenticateToken, identifyPlant as any);

export default router;
