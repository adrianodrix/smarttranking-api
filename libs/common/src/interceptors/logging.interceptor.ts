import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { IncomingMessage } from 'node:http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as momentTimeZone from 'moment-timezone';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now: number = Date.now();
    const userAgent: string = context.switchToHttp().getRequest().headers[
      'user-agent'
    ];
    const requestedUrl: string = context.getArgByIndex<IncomingMessage>(0).url;

    this.logger.log(
      `${requestedUrl} (${userAgent}): ${this.dateToString(now)}`,
    );
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(`Duration request: ${(Date.now() - now) / 1000}s`),
        ),
      );
  }

  private dateToString(value: number) {
    return momentTimeZone(value)
      .tz('America/Sao_Paulo')
      .format('YYYY-MM-DD HH:mm:ss.SSS');
  }
}
