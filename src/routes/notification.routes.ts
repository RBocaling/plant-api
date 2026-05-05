import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";
import { createNotification, getUserNotifications } from "../controllers/notif.controllers";

const router = Router();

router.post('/create-notif', authenticateToken, Roles("CUSTOMER"),  createNotification as any);
router.get('/get-notif', authenticateToken, Roles("CUSTOMER"),  getUserNotifications as any);

export default router;