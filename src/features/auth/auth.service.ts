import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { Role } from 'src/features/users/enums/role.enum';
import { Status } from 'src/features/users/enums/status.enum';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthResult } from './dto/auth_result.dto';
import { calculateExpiryDate } from 'src/core/utils/date.util';
import {
  accessTokenExpire,
  refreshTokenExpire,
} from 'src/core/constants/constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async signUp(
    email: string,
    password: string,
    role: Role = Role.USER,
    status: Status = Status.ACTIVE,
  ): Promise<AuthResult> {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: role,
          status: status,
        },
      });

      return this.createToken({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Unable to create user. Please try again later.',
      );
    }
  }

  async signIn(username: string, pass: string): Promise<AuthResult> {
    try {
      const user = await this.usersService.findOne(username);
      if (!user) {
        throw new UnauthorizedException('Invalid username or password.');
      }

      const passwordsMatch = await bcrypt.compare(pass, user.password);
      if (!passwordsMatch) {
        throw new UnauthorizedException('Invalid username or password.');
      }

      return this.createToken({
        id: user.id,
        email: user.email,
      });
    } catch (error) {
      if (error.status === 401) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Login failed, please try again later.',
        );
      }
    }
  }

  // トークン発行処理
  private async createToken(user: {
    id: number;
    email: string;
  }): Promise<AuthResult> {
    const payload = { sub: user.id, email: user.email };
    const secret = this.configService.get<string>('JWT_SECRET');

    const authResult = new AuthResult();
    authResult.access_token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: accessTokenExpire,
    });
    authResult.access_expires_at = calculateExpiryDate(3600);
    authResult.refresh_token = this.jwtService.sign(payload, {
      secret: secret,
      expiresIn: refreshTokenExpire,
    });
    authResult.refresh_expires_at = calculateExpiryDate(2592000);
    return authResult;
  }

  async refreshToken(token: string) {
    try {
      // リフレッシュトークンの検証
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      });
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }

      const newPayload = { sub: decoded.sub, email: decoded.email };
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRATION'),
      });

      return {
        access_token: newAccessToken,
        access_expires_in: calculateExpiryDate(
          this.configService.get<number>('ACCESS_TOKEN_EXPIRATION'),
        ),
      };
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnauthorizedException('Refresh token expired');
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    }
  }
}
