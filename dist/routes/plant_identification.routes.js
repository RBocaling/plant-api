"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const plant_identification_controllers_1 = require("../controllers/plant_identification.controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/validated-plants", plant_identification_controllers_1.getValidatedPlants);
router.post("/identify", auth_middleware_1.authenticateToken, plant_identification_controllers_1.identifyPlant);
exports.default = router;
