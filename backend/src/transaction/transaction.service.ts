import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { WalletService } from '../wallet/wallet.service';
import { newTransactionDto } from './dto';

@Injectable()
export class TransactionService {
  constructor(
    private prisma: PrismaService,
    config: ConfigService,
    private walletService: WalletService,
  ) {}

  async add(senderId: string, { receiverId, amount }: newTransactionDto) {
    if (senderId === receiverId)
      throw new ForbiddenException(
        'Wrong operation. SenderId and receiverId must be different.',
      );

    const senderWallet = await this.walletService.getUserWallet(senderId);
    const receiverWallet = await this.walletService.getUserWallet(receiverId);

    if (senderWallet.amountMajor < amount)
      throw new ForbiddenException('Wrong operation. Not enough money');

    await this.walletService.updateBalance(senderWallet.id, -amount);
    await this.walletService.updateBalance(receiverWallet.id, amount);

    const transaction = await this.prisma.transaction.create({
      data: {
        amountMajor: amount,
        amountMinor: 0,
        senderId,
        receiverId,
      },
    });

    return transaction;
  }

  async list(userId: string) {
    const list = await this.prisma.transaction.findMany({
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      where: {
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
    });

    return list;
  }
}
