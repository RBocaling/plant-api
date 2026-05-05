"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const router = (0, express_1.Router)();
router.get('/get-user-count', auth_middleware_1.authenticateToken, (0, role_middleware_1.Roles)("ADMIN"), user_controllers_1.getUserCountController);
exports.default = router;
