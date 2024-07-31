import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';
import { NotificationRepository } from './notification.repository';
import { NotificationMessage } from './types';
import { users } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(
    private notificationsGateway: NotificationGateway,
    private notificationsRepository: NotificationRepository,
  ) {}

  private logger = new Logger('NotificationService', { timestamp: true });

  async sendNotification(id: string, message: NotificationMessage) {
    this.validateProvidedFunctionParams(id, message);
    await this.saveNotificationOnDatabase(id, message);
    this.notificationsGateway.server.to(id).emit('notification', message);
    this.logger.verbose(`Notification sent to user ${id}`);
  }

  private validateProvidedFunctionParams(
    id: string,
    message: NotificationMessage,
  ): void {
    if (!id) {
      throw new InternalServerErrorException(
        'Error sending notification - id not provided',
      );
    }
    if (!message) {
      throw new InternalServerErrorException(
        'Error sending notification - message not provided',
      );
    }
    if (!message.title || !message.description) {
      throw new InternalServerErrorException(
        'Error sending notification - message must have title and description',
      );
    }
  }

  private async saveNotificationOnDatabase(
    id: users['id'],
    message: NotificationMessage,
  ) {
    return await this.notificationsRepository.saveNotificationOnDatabase({
      user: id,
      content: message,
    });
  }
}
