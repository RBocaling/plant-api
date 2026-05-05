"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logs_controllers_1 = require("../controllers/logs.controllers");
const router = (0, express_1.Router)();
router.get('/all-activity', logs_controllers_1.getAllActivityLogs);
exports.default = router;
