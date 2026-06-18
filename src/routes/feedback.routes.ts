import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";
import { createFeedback, getAllFeedbacks, respondToFeedback, updateFeedbackStatus, getFeedbackForUser } from "../controllers/feedback.controllers";

const router = Router();

router.post('/create-feedback', authenticateToken, Roles("CUSTOMER"),  createFeedback as any);
router.post('/make-response', authenticateToken, Roles("OWNER"),  respondToFeedback as any);
router.post('/update-status', authenticateToken, Roles("OWNER"),  updateFeedbackStatus as any);
router.get("/get-feedback", authenticateToken, Roles("OWNER", "ADMIN"), getAllFeedbacks as any);
router.get('/get-feedback-byuser', authenticateToken, Roles("CUSTOMER"),  getFeedbackForUser as any);
    
export default router;