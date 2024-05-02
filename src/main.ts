import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1');
  // グローバルに使用するミドルウェアはここで設定
  app.use(new LoggerMiddleware().use);
  await app.listen(3000);
}
bootstrap();
