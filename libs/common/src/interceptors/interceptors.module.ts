import { Module } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';
import { TimeoutInterceptor } from './timeout.interceptor';

@Module({
  providers: [LoggingInterceptor, TimeoutInterceptor],
  exports: [LoggingInterceptor, TimeoutInterceptor],
})
export class InterceptorsModule {}
