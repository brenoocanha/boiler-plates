import { Injectable } from '@nestjs/common';
import { PrismaConnection } from 'src/infra/database/prisma-connection';
import { NotificationMessage } from './types';
import { users } from '@prisma/client';

@Injectable()
export class NotificationRepository {
  constructor(private prisma: PrismaConnection) {}

  async saveNotificationOnDatabase({
    user: id,
    content,
  }: {
    user: users['id'];
    content: NotificationMessage;
  }) {
    return await this.prisma.notification.create({
      data: {
        ...content,
        users: {
          connect: {
            id,
          },
        },
      },
    });
  }
}
