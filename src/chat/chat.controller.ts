import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async createRoom(@Body() dto: any): Promise<any> {
    const { roomId } = dto;

    return this.chatService.createRoom(roomId);
  }

  @Get('rooms/:roomId')
  async getRoomUsers(@Param('roomId') roomId: string): Promise<any> {
    return this.chatService.getRoomUsers(roomId);
  }
}
