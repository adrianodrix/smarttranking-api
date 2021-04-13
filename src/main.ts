import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationBodyPipe } from './players/pipes/validation-body.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT, 10) || 3000;

  app.useGlobalPipes(new ValidationBodyPipe());
  await app.listen(port);
}
bootstrap();
