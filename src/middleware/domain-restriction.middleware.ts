import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class DomainRestrictionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isProduction = process.env.NODE_ENV === 'production';

    if (isProduction) {
      const origin = req.headers.origin;
      const referer = req.headers.referer;

      const allowedPatterns = [/^(https?:\/\/)?(.*\.)?moonlycoin\.com$/];

      const isAllowed = allowedPatterns.some(
        (pattern) =>
          (origin && pattern.test(origin.toString())) ||
          (referer && pattern.test(referer.toString())),
      );

      if (!isAllowed) {
        console.log('Production: Blocked request from:', { origin, referer });
        return res.status(403).json({
          statusCode: 403,
          message: 'Access Forbidden',
          error: 'Domain not allowed',
        });
      }
    } else {
      // Для разработки разрешаем Cloudflare и localhost
      const devPatterns = [
        /^(https?:\/\/)?(.*\.)?trycloudflare\.com$/,
        /^(https?:\/\/)?localhost(:\d+)?$/,
        /^(https?:\/\/)?127\.0\.0\.1(:\d+)?$/,
      ];

      const origin = req.headers.origin;
      const referer = req.headers.referer;

      const isAllowed = devPatterns.some(
        (pattern) =>
          (origin && pattern.test(origin.toString())) ||
          (referer && pattern.test(referer.toString())),
      );

      if (!isAllowed) {
        console.log('Development: Blocked request from:', { origin, referer });
        return res.status(403).json({
          statusCode: 403,
          message: 'Access Forbidden',
          error: 'Dev domain not allowed',
        });
      }
    }

    next();
  }
}
