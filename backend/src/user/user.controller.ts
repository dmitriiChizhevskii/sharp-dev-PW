import { Controller, HttpStatus, Get, HttpCode } from '@nestjs/common';
import { GetCurrentUserId } from '../common/decorators';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('list')
  @HttpCode(HttpStatus.OK)
  list(@GetCurrentUserId() userId: string) {
    return this.userService.getList(userId);
  }
}
