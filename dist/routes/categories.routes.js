"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const role_middleware_1 = require("../middlewares/role.middleware");
const category_controllers_1 = require("../controllers/category.controllers");
const router = (0, express_1.Router)();
//For Category Routes
router.get('/get-categories', auth_middleware_1.authenticateToken, (0, role_middleware_1.Roles)("CUSTOMER"), category_controllers_1.getCategories);
router.get('/get-categories/:id', auth_middleware_1.authenticateToken, (0, role_middleware_1.Roles)("CUSTOMER"), category_controllers_1.getCategory);
router.post('/add-category', category_controllers_1.upload.single('image'), auth_middleware_1.authenticateToken, (0, role_middleware_1.Roles)("CUSTOMER"), category_controllers_1.addCategory);
router.put('/edit-category/:id', category_controllers_1.upload.single('image'), auth_middleware_1.authenticateToken, (0, role_middleware_1.Roles)("CUSTOMER"), category_controllers_1.editCategory);
router.delete('/delete-category/:id', auth_middleware_1.authenticateToken, (0, role_middleware_1.Roles)("CUSTOMER"), category_controllers_1.removeCategory);
exports.default = router;
