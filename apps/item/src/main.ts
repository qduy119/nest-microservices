import { NestFactory } from '@nestjs/core';
import { ItemModule } from './item.module';

async function bootstrap() {
  const app = await NestFactory.create(ItemModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
