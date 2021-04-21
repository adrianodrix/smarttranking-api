import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import * as momentTimeZone from 'moment-timezone';
import { RankingsModule } from './rankings/rankings.module';

const logger = new Logger('Main');
const config = new ConfigService();

async function bootstrap() {
  const optionsRMQ = {
    user: config.get<string>('RMQ_USER'),
    pass: config.get<string>('RMQ_PASS'),
    host: config.get<string>('RMQ_HOST'),
  };

  const app = await NestFactory.createMicroservice(RankingsModule, {
    transport: Transport.RMQ,
    options: {
      urls: [`amqp://${optionsRMQ.user}:${optionsRMQ.pass}@${optionsRMQ.host}`],
      noAck: false,
      queue: 'rankings-backend',
    },
  });

  init();

  app.listen(() =>
    logger.log("MicroService 'MICRO-RANKING-BACKEND' is listening"),
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
