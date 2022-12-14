import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 9001;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5000',
      'http://localhost:9001',
      'https://joshkrab.github.io/ws-client/',
      'https://joshkrab.github.io',
    ],
  });

  // Run server:
  await app.listen(PORT, () => {
    console.log(`Server started on: http://localhost:${PORT}`);
  });
}
bootstrap();
