import { User } from '@prisma/client';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getList(
    userId: string,
  ): Promise<Pick<User, 'email' | 'name' | 'id'>[]> {
    const users = await this.prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return users;
  }
}
