import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';

// (PORT, {})
// @WebSocketGateway(80, {
//   namespace: 'chat',
// })
@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
  // Server for sending messages from here
  @WebSocketServer()
  server: Server;

  // Output in console info about connection
  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
      console.log('Connected');
    });
  }

  // Subscribed to the 'newMessage' event name - we can send messages to the server with this name
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any): void {
    console.log(body);
    // Created event 'onMessage' in postman(frontend), who will receive the message
    this.server.emit('onMessage', {
      message: 'New message',
      content: body,
    });
  }
}
