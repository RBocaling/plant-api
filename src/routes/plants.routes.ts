import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { Roles } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';
import { getPlants, getPlant, addPlant, editPlant, removePlant, uploadPlantImages, } from '../controllers/plantInfo.controllers';
  
const router = Router();

const uploadImage = uploadPlantImages.fields([
  { name: 'image', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }])
//For Plant Info Routes
router.get('/get-plants',  authenticateToken, getPlants as any);
router.get('/get-plants/:id',  authenticateToken, getPlant as any);
router.post('/add-plant', uploadImage,  authenticateToken, addPlant as any
);

router.put('/edit-plant/:id', uploadPlantImages.fields([
    { name: 'image', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }]), authenticateToken, editPlant as any);
router.delete('/delete-plant/:id',  authenticateToken, removePlant);

export default router;