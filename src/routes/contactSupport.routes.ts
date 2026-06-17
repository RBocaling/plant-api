import { Router } from "express";
import { getAllContactSupport, getMyContactSupport, insertContactSupport, replyToContactSupport } from "../controllers/contactSupport.controller";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";

const router = Router();

router.post("/", insertContactSupport as any);
router.post("/reply", authenticateToken, Roles("OWNER", "ADMIN"), replyToContactSupport as any);
router.get("/my-messages", authenticateToken, Roles("CUSTOMER"), getMyContactSupport as any);
router.get("/", getAllContactSupport as any);

export default router;