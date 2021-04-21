import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as momentTimeZone from 'moment-timezone';
import { AppModule } from './app.module';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [
        `amqp://${process.env.RMQ_USER}:${process.env.RMQ_PASS}@${process.env.RMQ_HOST}`,
      ],
      noAck: false,
      queue: 'admin-backend',
    },
  });

  init();

  app.listen(() =>
    logger.log("MicroService 'MICRO-ADMIN-BACKEND' is listening"),
  );
}

function init() {
  logger.log('Prototypes initialized');
  Date.prototype.toJSON = function (): any {
    return momentTimeZone(this)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  };
}

bootstrap();
