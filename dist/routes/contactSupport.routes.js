"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contactSupport_controller_1 = require("../controllers/contactSupport.controller");
const router = (0, express_1.Router)();
router.post("/", contactSupport_controller_1.insertContactSupport);
router.post("/reply", contactSupport_controller_1.replyToContactSupport);
router.get("/", contactSupport_controller_1.getAllContactSupport);
exports.default = router;
