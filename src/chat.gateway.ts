import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';

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
        // .broadcast.to() - for everyone but me, except for yourself
        // Send socket request 'ROOM:JOINED'
        socket.broadcast.to(data.roomId).emit('ROOM:SET_USERS', users);
        //
      });
      // Delete users when disconnect:
      socket.on('disconnect', () => {
        // forEach((value, key)...
        rooms.forEach((value, roomId) => {
          // Delete from collection users
          if (value.get('users').delete(socket.id)) {
            const users = [...value.get('users').values()];
            socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users);
          }
        });
      });

      socket.on('ROOM:NEW_MESSAGE', (data) => {
        const messageObj = { userName: data.userName, text: data.text };
        rooms.get(data.roomId).get('messages').push(messageObj);
        socket.broadcast.to(data.roomId).emit('ROOM:NEW_MESSAGE', messageObj);
      });

      console.log('Connection created: ', socket.id);
    });
  }
}
