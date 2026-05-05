"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const plantInfo_controllers_1 = require("../controllers/plantInfo.controllers");
const router = (0, express_1.Router)();
const uploadImage = plantInfo_controllers_1.uploadPlantImages.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
]);
//For Plant Info Routes
router.get('/get-plants', auth_middleware_1.authenticateToken, plantInfo_controllers_1.getPlants);
router.get('/get-plants/:id', auth_middleware_1.authenticateToken, plantInfo_controllers_1.getPlant);
router.post('/add-plant', uploadImage, auth_middleware_1.authenticateToken, plantInfo_controllers_1.addPlant);
router.put('/edit-plant/:id', plantInfo_controllers_1.uploadPlantImages.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
]), auth_middleware_1.authenticateToken, plantInfo_controllers_1.editPlant);
router.delete('/delete-plant/:id', auth_middleware_1.authenticateToken, plantInfo_controllers_1.removePlant);
exports.default = router;
