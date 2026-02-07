import { Router } from "express";
import { identifyPlant } from "../controllers/plant_identification.controllers";
import { authenticateToken } from "../middlewares/auth.middleware";

const router = Router();

router.post("/identify", authenticateToken, identifyPlant as any);

export default router;
