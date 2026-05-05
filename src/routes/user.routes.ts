import { Router } from 'express';
import { getUserCountController } from '../controllers/user.controllers';
import { authenticateToken } from '../middlewares/auth.middleware';
import { Roles } from '../middlewares/role.middleware';
import { UserRole } from '@prisma/client';

const router = Router();


router.get('/get-user-count', authenticateToken, Roles(UserRole.ADMIN),  getUserCountController as any);

export default router;