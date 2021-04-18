import { NestFactory } from '@nestjs/core';
import * as momentTimeZone from 'moment-timezone';
import { AppModule } from './app.module';
import { AllExceptionFilter } from '../../../libs/common/src/filters/all-exception.filter';
import { LoggingInterceptor } from '@lib/common/interceptors/logging.interceptor';
import { TimeoutInterceptor } from '@lib/common/interceptors/timeout.interceptor';
import { ValidationBodyPipe } from '@lib/common/pipes/validation-body.pipe';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LoggingInterceptor(), new TimeoutInterceptor());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalPipes(new ValidationBodyPipe());

  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };

  await app.listen(8080, () => {
    const logger = new Logger('API Gateway');
    logger.log('Server initialized');
  });
}
bootstrap();
