import { Router } from "express";
import {
  getAdminSettings,
  getPublicSettings,
  patchAdminSettings,
  checkReportsExport,
} from "../controllers/systemSettings.controllers";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";

const router = Router();

router.get("/public", getPublicSettings as any);
router.get(
  "/reports-export-check",
  authenticateToken,
  Roles("OWNER", "ADMIN"),
  checkReportsExport as any
);
router.get(
  "/",
  authenticateToken,
  Roles("OWNER"),
  getAdminSettings as any
);
router.patch(
  "/",
  authenticateToken,
  Roles("OWNER"),
  patchAdminSettings as any
);

export default router;
