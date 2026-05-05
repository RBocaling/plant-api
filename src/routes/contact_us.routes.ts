import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";
import {
  contactUsController,
  getContactUsController,
} from "../controllers/contact_us.controllers";

const router = Router();

router.post(
  "/create-contact-us",
  authenticateToken,
  Roles("CUSTOMER"),
  contactUsController as any
);
router.get("/get-contact-us", getContactUsController as any);


export default router;