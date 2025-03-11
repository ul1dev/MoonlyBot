import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CryptoService } from '../crypto/crypto.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class SecureInterceptor implements NestInterceptor {
  constructor(
    private readonly cryptoService: CryptoService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    // Проверка заголовков
    const timestamp = request.headers['x-timestamp'];
    const nonce = request.headers['x-nonce'];
    const iv = request.headers['x-iv'];

    if (!timestamp || !nonce || !iv) {
      throw new BadRequestException('Missing security headers');
    }

    // Проверка времени жизни запроса
    const currentTime = Date.now();
    const timestampNum = parseInt(timestamp);

    if (currentTime - timestampNum > 60000) {
      throw new ForbiddenException('Request expired');
    }

    // Проверка что timestamp валидный
    if (isNaN(timestampNum)) {
      throw new BadRequestException('Invalid timestamp format');
    }

    // Проверка что timestamp не из будущего
    if (timestampNum > Date.now() + 1000) {
      // Допуск 1 секунда
      throw new ForbiddenException('Invalid future timestamp');
    }

    // Проверка уникальности nonce
    const exists = await this.cacheManager.get(nonce);
    if (exists) {
      throw new ForbiddenException('Duplicate request');
    }
    await this.cacheManager.set(nonce, true, 70); // TTL 70 сек

    // Расшифровка body
    if (request.body?.data) {
      try {
        request.body = this.cryptoService.decrypt(request.body.data, iv);
      } catch (e) {
        throw new BadRequestException('Invalid encrypted data');
      }
    }

    return next.handle();
  }
}
