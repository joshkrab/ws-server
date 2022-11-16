import { Injectable } from '@nestjs/common';

export const rooms = new Map();

@Injectable()
export class ChatService {
  async createRoom(roomId: string) {
    if (!rooms.has(roomId)) {
      rooms.set(
        roomId,
        new Map<string, any>([
          ['users', new Map()],
          ['messages', []],
        ]),
      );
      console.log('Room created:', rooms);

      return roomId;
    }
  }
}
