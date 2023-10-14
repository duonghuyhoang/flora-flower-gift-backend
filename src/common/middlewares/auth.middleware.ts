import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      req['userInfo'] = decodedToken;

      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
