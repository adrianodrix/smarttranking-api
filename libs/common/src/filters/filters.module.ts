import { Module } from '@nestjs/common';
import { AllExceptionFilter } from './all-exception.filter';

@Module({
  providers: [AllExceptionFilter],
  exports: [AllExceptionFilter],
})
export class FiltersModule {}
