import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PrismaConnection } from 'src/infra/database/prisma-connection';

@Module({
  providers: [UsersService, UsersRepository, PrismaConnection],
})
export class UsersModule {}
