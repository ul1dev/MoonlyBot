import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DomainRestrictionMiddleware } from './middleware/domain-restriction.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5000;
  const isProduction = process.env.NODE_ENV === 'production';

  // 1. Глобальная валидация
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 2. Подключаем middleware ДО CORS
  app.use(new DomainRestrictionMiddleware().use);

  // isProduction
  //   ? [/https?:\/\/(.*\.)?moonlycoin\.com$/]
  //   : [
  //       /https?:\/\/(.*\.)?trycloudflare\.com$/,
  //       /https?:\/\/localhost(:\d+)?$/,
  //       /https?:\/\/127\.0\.0\.1(:\d+)?$/,
  //     ];

  // 3. Настройка CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type,Authorization,X-Requested-With',
  });

  await app.listen(PORT, () => {
    console.log(`Server started on port: ${PORT}`);
    console.log(`Environment: ${isProduction ? 'production' : 'development'}`);
    console.log(
      'Allowed origins:',
      isProduction
        ? '*.moonlycoin.com'
        : '*.trycloudflare.com, localhost, 127.0.0.1',
    );
  });
}

bootstrap();
