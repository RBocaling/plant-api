
import { UserRole } from './roles';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: UserRole;
        firstName: string;
      };
    }
  }
}
