import {
  INestApplication,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaConnection
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  async enableShutdownHooks(app: INestApplication) {
    // @ts-expect-error Property 'beforeExit' does not exist on type 'PrismaClient'.
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }

  // TODO: Implement this method to use in tests
  // async cleanDatabase() {
  //   if (process.env.STAGE !== 'test') return;

  //   const deleteUsers = this.users.deleteMany();
  // }
}
