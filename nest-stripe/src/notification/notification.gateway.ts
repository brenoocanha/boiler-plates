import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer()
  server: Server;

  private activeUsers: Map<string, string> = new Map();

  handleConnection(client: Socket): void {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.activeUsers.set(userId, client.id);
      client.join(userId);
      console.log(`Client connected: ${client.id} (User ID: ${userId})`);
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = Array.from(this.activeUsers.keys()).find(
      (key) => this.activeUsers.get(key) === client.id,
    );
    if (userId) {
      this.activeUsers.delete(userId);
      client.leave(userId);
      console.log(`Client disconnected: ${client.id} (User ID: ${userId})`);
    }
  }

  @SubscribeMessage('sendNotification')
  handleNotification(
    @MessageBody() data: { userId?: string; message: string },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @ConnectedSocket() client: Socket,
  ): void {
    if (data.userId) {
      this.server.to(data.userId).emit('notification', data.message);
    } else {
      this.server.emit('notification', data.message);
    }
  }
}
