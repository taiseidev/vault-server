import * as admin from 'firebase-admin';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CURRENT_VERSION } from './core/constants/paths';
import { LoggerMiddleware } from './core/middlewares/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const serviceAccount = require('/Users/t-z/workspace/product/vault/vault-server/src/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  app.setGlobalPrefix(CURRENT_VERSION);
  app.use(new LoggerMiddleware().use);

  await app.listen(3000);
}

bootstrap();
