import { Router } from "express";
import { getAllContactSupport, insertContactSupport, replyToContactSupport } from "../controllers/contactSupport.controller";

const router = Router();

router.post("/", insertContactSupport as any);
router.post("/reply", replyToContactSupport as any);
router.get("/", getAllContactSupport as any);

export default router;