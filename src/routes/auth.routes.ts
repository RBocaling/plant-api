import { Router } from 'express';
import {
  getInfo,
  login,
  refreshAccessToken,
  register,
  updatePassword,
  updateUser,
  fetchAllCustomerUsers,
  fetchAllAdminUsers,
  fetchAllSubAdmin,
  removeUser,
  verifyAccountOtp,
  deleteAccount,
  updateRole,
} from "../controllers/auth.controllers";
import { authenticateToken } from "../middlewares/auth.middleware";
import { Roles } from "../middlewares/role.middleware";

const router = Router();

//For Login/Register Routes
router.post("/register", register as any);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken as any);
router.get("/get-info", authenticateToken, getInfo as any);
router.get("/get-users-list", fetchAllCustomerUsers as any);
router.get("/get-itadmin-list", authenticateToken, fetchAllAdminUsers as any);
router.get("/get-admins-list", authenticateToken, fetchAllSubAdmin as any);
router.post(
  "/change-password",
  authenticateToken,
  Roles("CUSTOMER"),
  updatePassword as any
);
router.post("/edit-user", authenticateToken, updateUser as any);
router.post(
  "/delete-user/:id",
  authenticateToken,
  Roles("ADMIN"),
  removeUser as any
);
router.post("/verify-account", verifyAccountOtp as any);
router.post("/delete-account", deleteAccount as any);
router.put("/update-role", updateRole as any);

export default router;
