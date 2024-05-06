import { Controller } from '@nestjs/common';
import { UsersService } from './users.service';
import { USERS_PATH } from 'src/core/constants/paths';

@Controller(USERS_PATH)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
