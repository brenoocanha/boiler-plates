import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationGateway } from './notification.gateway';
import { NotificationRepository } from './notification.repository';
import { PrismaConnection } from 'src/infra/database/prisma-connection';

@Module({
  providers: [
    NotificationService,
    NotificationGateway,
    NotificationRepository,
    PrismaConnection,
  ],
})
export class NotificationModule {}
