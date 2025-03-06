import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5000;

  const corsOptions = {
    credentials: true,
    origin: '*',
  };

  // const expressApp = app.getHttpAdapter().getInstance();

  // expressApp.set('trust proxy', true);

  app.useGlobalPipes(new ValidationPipe());
  app.use(cors(corsOptions));

  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();
