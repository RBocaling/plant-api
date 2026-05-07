import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";
import { createSupportConcern, getAllSupportConcerns, getSupportConcernById,replyToSupport } from "../controllers/support_chat.controllers";
import {
  getAISupportHistory,
  postAISupportChat,
} from "../controllers/ai_support_chat.controllers";
import { createSupportRateLimiter } from "../middlewares/support_rate_limit.middleware";

const router = Router();
const supportCreateLimiter = createSupportRateLimiter(5, 60 * 1000);
const supportAiChatLimiter = createSupportRateLimiter(20, 60 * 1000);

router.post('/create-concern', authenticateToken, Roles("CUSTOMER"), supportCreateLimiter as any,  createSupportConcern as any);
router.post('/reply-response', authenticateToken, Roles("SPECIALIST"),  replyToSupport as any);
router.get('/get-all-concern', authenticateToken, Roles("SPECIALIST"),  getAllSupportConcerns as any);
router.get('/get-concern/:id', authenticateToken, Roles("SPECIALIST"),  getSupportConcernById as any);
router.post("/ai-chat", authenticateToken, Roles("CUSTOMER"), supportAiChatLimiter as any, postAISupportChat as any);
router.get("/ai-chat/history", authenticateToken, Roles("CUSTOMER"), getAISupportHistory as any);



export default router;