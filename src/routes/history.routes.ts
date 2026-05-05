import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";
import { createHistoryController,getAllHistory,getHistoryByUserController } from "../controllers/history.controllers";

const router = Router();

router.post('/create-history', authenticateToken, Roles("CUSTOMER"),  createHistoryController as any);
router.get('/get-history', authenticateToken, Roles("CUSTOMER"),  getHistoryByUserController as any);
router.get('/get-all-history',  getAllHistory as any);

export default router;