import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AUTH_PATH,
  LOGIN,
  PROFILE,
  REFRESH,
  SIGN_UP,
} from 'src/core/constants/paths';
import { Public } from 'src/core/common/public.decorator';

@Controller(AUTH_PATH)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(SIGN_UP)
  @HttpCode(HttpStatus.OK)
  @Public()
  signUp(@Body() signInDto: Record<string, any>) {
    return this.authService.signUp(signInDto.email, signInDto.password);
  }

  @Post(LOGIN)
  @HttpCode(HttpStatus.OK)
  @Public()
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Get(PROFILE)
  getProfile(@Request() req) {
    return req.user;
  }

  @Post(REFRESH)
  async refresh(@Body() body: { refresh_token: string }) {
    return this.authService.refreshToken(body.refresh_token);
  }
}
