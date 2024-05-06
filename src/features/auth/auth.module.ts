import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/features/users/users.module';
import { UsersService } from 'src/features/users/users.service';
import { PrismaService } from 'prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [UsersModule],
  providers: [AuthService, UsersService, PrismaService, JwtService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
