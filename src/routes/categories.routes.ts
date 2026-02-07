import { Router } from 'express';
import { authenticateToken } from '../middlewares/auth.middleware';
import { Roles } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';
import {
    getCategories,
    getCategory,
    addCategory,
    editCategory,
    removeCategory,
    upload,
  } from '../controllers/category.controllers';

const router = Router();

//For Category Routes
router.get('/get-categories', authenticateToken, Roles(UserRole.CUSTOMER),  getCategories as any);
router.get('/get-categories/:id', authenticateToken, Roles(UserRole.CUSTOMER), getCategory as any);
router.post('/add-category', upload.single('image'), authenticateToken, Roles(UserRole.CUSTOMER),  addCategory as any);
router.put('/edit-category/:id', upload.single('image'), authenticateToken, Roles(UserRole.CUSTOMER), editCategory as any);
router.delete('/delete-category/:id',authenticateToken, Roles(UserRole.CUSTOMER),  removeCategory);

export default router;