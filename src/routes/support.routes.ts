import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { Roles } from "../middlewares/role.middleware";
import { createSupportConcern, getAllSupportConcerns, getSupportConcernById,replyToSupport } from "../controllers/support_chat.controllers";

const router = Router();

router.post('/create-concern', authenticateToken, Roles(UserRole.CUSTOMER),  createSupportConcern as any);
router.post('/reply-response', authenticateToken, Roles(UserRole.SPECIALIST),  replyToSupport as any);
router.get('/get-all-concern', authenticateToken, Roles(UserRole.SPECIALIST),  getAllSupportConcerns as any);
router.get('/get-concern/:id', authenticateToken, Roles(UserRole.SPECIALIST),  getSupportConcernById as any);



export default router;