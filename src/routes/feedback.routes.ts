import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { UserRole } from "@prisma/client";
import { Roles } from "../middlewares/role.middleware";
import { createFeedback, getAllFeedbacks, respondToFeedback, updateFeedbackStatus, getFeedbackForUser } from "../controllers/feedback.controllers";

const router = Router();

router.post('/create-feedback', authenticateToken, Roles(UserRole.CUSTOMER),  createFeedback as any);
router.post('/make-response', authenticateToken, Roles(UserRole.OWNER),  respondToFeedback as any);
router.post('/update-status', authenticateToken, Roles(UserRole.OWNER),  updateFeedbackStatus as any);
router.get("/get-feedback", getAllFeedbacks as any);
router.get('/get-feedback-byuser', authenticateToken, Roles(UserRole.CUSTOMER),  getFeedbackForUser as any);
    
export default router;