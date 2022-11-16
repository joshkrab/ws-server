import { OnModuleInit } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server } from 'socket.io';
import { rooms } from './chat/chat.service';

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
        // Get collection of users and save current user and id
        rooms.get(data.roomId).get('users').set(socket.id, data.userName);
        // Get all users:
        const users = [...rooms.get(data.roomId).get('users').values()];

        // We create an event for the room:
        // .broadcast - for everyone but me, except for yourself
        // Send socket request 'ROOM:JOINED'
        socket.broadcast.to(data.roomId).emit('ROOM:JOINED', users);
        //
      });
      // 1:47
      console.log('Connection created: ', socket.id);
    });
  }

  // Subscribed to the 'newMessage' event name - we can send messages to the server with this name
  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any): void {
    // console.log('Message body: ', body);

    // Created event 'onMessage' in postman(frontend), who will receive the message:
    // socket.on('onMessage',{}) - on frontend
    this.server.emit('onMessage', {
      message: 'New message',
      content: body,
    });
  }
}
