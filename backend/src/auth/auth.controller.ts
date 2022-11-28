import {
  Body,
  Controller,
  HttpStatus,
  Get,
  Post,
  HttpCode,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto, AuthDtoWithName } from './dto';
import { Tokens } from './types';
import { Public, GetCurrentUserId, GetCurrentUser } from '../common/decorators';
import { RtGuard } from '../common/guards';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('check')
  @HttpCode(HttpStatus.OK)
  check(@GetCurrentUserId() userId: string,): object {
    return this.authService.getUser(userId);
  }

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() dto: AuthDtoWithName): Promise<Tokens> {
    return this.authService.signup(dto);
  }

  @Public()
  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() dto: AuthDto): Promise<Tokens> {
    return this.authService.signin(dto);
  }

  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(
    @GetCurrentUser('refreshToken') refreshToken: string,
    @GetCurrentUserId() userId: string,
  ): Promise<Tokens> {
    return this.authService.refresh(userId, refreshToken);
  }
}
