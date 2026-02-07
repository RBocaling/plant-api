import { Router } from 'express';
import { requestOTP, confirmOTP, submitNewPassword} from '../controllers/forgotPassword.controllers';

const router = Router();

//For OTP Routes
router.post('/request-otp', requestOTP as any);
router.post('/confirm-otp', confirmOTP as any);
router.post('/reset', submitNewPassword as any); 

export default router;