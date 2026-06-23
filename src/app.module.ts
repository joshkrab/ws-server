import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatModule } from './chat/chat.module';
import { HealthController } from './health.controller';

@Module({
  imports: [ChatModule],
  controllers: [HealthController],
  providers: [ChatGateway],
})
export class AppModule {}
