import { Controller, HttpStatus, Get, HttpCode } from '@nestjs/common';
import { GetCurrentUserId } from '../common/decorators';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @Get('info')
  @HttpCode(HttpStatus.OK)
  check(@GetCurrentUserId() userId: string): object {
    return this.walletService.getUserWallete(userId);
  }
}
