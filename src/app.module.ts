import { Module } from '@nestjs/common';
import { HttpClientService } from './core/api/http-client.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './features/auth/auth.guard';
import { HttpModule } from '@nestjs/axios';
import { FeaturesModule } from './features/features.module';

@Module({
  imports: [
    HttpModule,
    FeaturesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env.${process.env.NODE_ENV}`, `.env`],
      load: [],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    HttpClientService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
``;
