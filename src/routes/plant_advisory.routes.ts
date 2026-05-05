import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";
import { createPlantAdvisory, getAllPlantAdvisories, getPlantAdvisoryByIdController, updateAdvisoryStatus, updateAdvisoryPriority, respondToAdvisory } from "../controllers/plant_advisory.controllers";

const router = Router();

router.post('/create-advisory', authenticateToken, Roles("CUSTOMER"),  createPlantAdvisory as any);
router.get('/get-all-advisory', authenticateToken,  getAllPlantAdvisories as any);
router.get('/get-advisory/:id', authenticateToken, Roles("SPECIALIST"),  getPlantAdvisoryByIdController as any);
router.post('/update-status', authenticateToken, Roles("SPECIALIST"), updateAdvisoryStatus as any);
router.post('/update-priority', authenticateToken, Roles("SPECIALIST"), updateAdvisoryPriority as any);
router.post('/make-response', authenticateToken,  respondToAdvisory as any);

export default router;