import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

// (PORT, {})
// @WebSocketGateway(80, {
//   namespace: 'chat',
// })
@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: any;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit('message', message);
  }
}
