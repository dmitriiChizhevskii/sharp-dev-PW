import { Wallet } from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
  award: number;

  constructor(private prisma: PrismaService, config: ConfigService) {
    this.award = Number(config.get<string>('AWARD'));
  }

  async createWallet(userId: string): Promise<Wallet> {
    return this.prisma.wallet
      .create({
        data: {
          userId,
          amountMajor: this.award,
          amountMinor: 0,
        },
      })
      .catch((e) => {
        throw new ForbiddenException(e.meta.message);
      });
  }

  async updateBalance(walletId: string, sum: number): Promise<Wallet> {
    const updatedWallet = await this.prisma.wallet.update({
      where: {
        id: walletId,
      },
      data: {
        amountMajor: { increment: sum },
      },
    });

    return updatedWallet;
  }

  async getUserWallete(userId: string): Promise<Wallet> {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        userId,
      },
    });

    return wallet;
  }
}
