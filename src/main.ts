import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT = process.env.PORT || 9001;
  const app = await NestFactory.create(AppModule);

  // Run server:
  await app.listen(PORT, () => {
    console.log(`Server started on: http://localhost:${PORT}`);
  });
}
bootstrap();
