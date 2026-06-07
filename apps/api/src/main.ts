import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const port = Number(process.env.PORT ?? 3001);
  const origin = process.env.WEB_ORIGIN ?? 'http://localhost:5173';

  app.enableCors({
    origin: origin.split(','),
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'X-Garden-User'],
    credentials: false,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port, '0.0.0.0');
  // eslint-disable-next-line no-console
  console.log(`API listening on :${port} (CORS origin: ${origin})`);
}

bootstrap();
