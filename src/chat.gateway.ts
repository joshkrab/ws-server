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
        // Connect to room:
        socket.join(data.roomId);
        // When we connected to room, we want to get room object:
        // Then we get collection of users and save current user and id
        this.rooms.get(data.roomId).get('users').set(socket.id, data.userName);
        // Get all users:
        const users = this.rooms.get(data.roomId).get('users').values();
        // We create an event for the room:
        // .broadcast - for everyone but me, except for yourself
        // Send socket request 'ROOM:JOINED'
        socket.broadcast.to(data.roomId).emit('ROOM:JOINED', users);
        //
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
          ['users', new Map()],
          ['messages', []],
        ]),
      );
    }
    console.log(this.rooms);
    return roomId;
  }
}
