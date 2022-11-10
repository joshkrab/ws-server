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
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  },
})
export class ChatGateway implements OnModuleInit {
  rooms = new Map();

  // Server for sending messages from here
  @WebSocketServer()
  server: Server;

  // Output in console info about connection
  onModuleInit() {
    this.server.on('connection', (socket) => {
      // Listen event:
      socket.on('ROOM:JOIN', (data) => {
        console.log(data);
        // Connect to room:
        socket.join(data.roomId);
        // 1:23
      });

      console.log('User connected: ', socket.id);
    });
  }

  // Subscribed to the 'newMessage' event name - we can send messages to the server with this name
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any): void {
    console.log('Message body: ', body);

    // Created event 'onMessage' in postman(frontend), who will receive the message:
    // socket.on('onMessage',{}) - on frontend
    this.server.emit('onMessage', {
      message: 'New message',
      content: body,
    });
  }

  async createRoom(roomId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(
        roomId,
        new Map<string, any>([
          ['user', new Map()],
          ['messages', []],
        ]),
      );
    }
    console.log(this.rooms);
    return roomId;
  }
}
