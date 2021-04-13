import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ValidationBodyPipe } from './common/pipes/validation-body.pipe';
import * as momentTimeZone from 'moment-timezone';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = parseInt(process.env.PORT, 10) || 3000;

  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationBodyPipe());

  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(port);
}
bootstrap();
