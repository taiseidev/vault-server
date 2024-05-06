// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// @Public()デコレータを使用することで特定のエンドポイントをJWTトークンなしで叩けるようにする。
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
