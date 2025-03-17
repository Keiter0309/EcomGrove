import { JwtPayload } from './common/types/jwt.inteface';
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
