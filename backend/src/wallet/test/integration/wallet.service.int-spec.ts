import { Test } from '@nestjs/testing';
import { Prisma } from '@prisma/client';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletService } from 'src/wallet/wallet.service';
import { ConfigService } from '@nestjs/config';

describe('WallerService Int', () => {
  let prisma: PrismaService;
  let walletService: WalletService;
  let config: ConfigService;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    walletService = moduleRef.get(WalletService);
    config = moduleRef.get(ConfigService);

    await prisma.cleanDatabase();
  });

  describe('createWallet()', () => {
    it('should create user', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'pw',
          email: 'pw@gmail.com',
          hash: 'some-hash',
        },
      });
      userId = user.id;
    });
    it('should create wallet', async () => {
      const wallet = await walletService.createWallet(userId);
      expect(wallet.amountMajor).toBe(Number(config.get<string>('AWARD')));
    });
    it('should throw with wrong user id', async () => {
      await walletService
        .createWallet('wrong id')
        .then((wallet) => expect(wallet).toBeUndefined())
        .catch((e) => expect(e.status).toBe(403));
    });
  });

  describe('updateWallet()', () => {
    it('should update sum correctly', async () => {
      const incValue = 100;
      const wallet = await walletService.createWallet(userId);
      const updatedWallet = await walletService.updateBalance(
        wallet.id,
        incValue,
      );
      expect(updatedWallet.amountMajor).toBe(
        Number(config.get<string>('AWARD')) + incValue
      );
    });
  });
});
