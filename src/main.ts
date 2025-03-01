import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.PORT ?? 5000;
  await app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
}
bootstrap();

// сделать вывод всех ошибок в канал

// сделать выполнение команд по гс

// сделать функцию переноса события и команду перенеси

// сделать чтоб можно было пересылать сообщения, бот находил в них дату и время и создавал событие спрашивая только название

// переделать ссылки чтобы они были в формате start=jgfhsdgfs234234 и ими можно было управлять и деактивировать

// сделать обработчик выполнения команд и нажатий на кнопок в middlwares для вывода статистики
