import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WalletService {
  award: number;

  constructor(private prisma: PrismaService, config: ConfigService) {
    this.award = Number(config.get<string>('AWARD'));
  }

  async createWallet(userId: string): Promise<boolean> {
    await this.prisma.wallet.create({
      data: {
        userId,
        amountMajor: this.award,
        amountMinor: 0,
      },
    });

    return true;
  }

  async updateBalance(walletId: string, sum: number) {
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

  async getUserWallete(userId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        userId,
      },
    });

    return wallet;
  }
}
