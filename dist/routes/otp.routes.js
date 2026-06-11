"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const forgotPassword_controllers_1 = require("../controllers/forgotPassword.controllers");
const router = (0, express_1.Router)();
//For OTP Routes
router.post('/request-otp', forgotPassword_controllers_1.requestOTP);
router.post('/confirm-otp', forgotPassword_controllers_1.confirmOTP);
router.post('/reset', forgotPassword_controllers_1.submitNewPassword);
exports.default = router;
