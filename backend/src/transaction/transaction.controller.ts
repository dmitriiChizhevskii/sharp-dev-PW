import { Controller, HttpStatus, Post, HttpCode, Body } from '@nestjs/common';
import { GetCurrentUserId } from '../common/decorators';
import { TransactionService } from './transaction.service';
import { newTransactionDto } from './dto';

@Controller('transaction')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Post('add')
  @HttpCode(HttpStatus.OK)
  add(@GetCurrentUserId() userId: string, @Body() params: newTransactionDto) {
    return this.transactionService.add(userId, params);
  }

  @Post('list')
  @HttpCode(HttpStatus.OK)
  list(@GetCurrentUserId() userId: string) {
    return this.transactionService.list(userId);
  }
}
