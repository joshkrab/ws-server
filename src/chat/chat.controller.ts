import { Body, Controller, Post } from '@nestjs/common';
import { ChatGateway } from 'src/chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(private socketService: ChatGateway) {}

  @Post()
  async createRoom(@Body() dto: any): Promise<any> {
    console.log('Hello dto:', dto);
    const { roomId } = dto;

    return this.socketService.createRoom(roomId);
  }
}
