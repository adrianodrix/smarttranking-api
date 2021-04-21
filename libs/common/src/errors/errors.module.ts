import { Module } from '@nestjs/common';
import { BadRequestError } from './bad-request.error';
import { DuplicateKeyError } from './DuplicateKeyError.error';
import { NotFoundError } from './not-found.error';

@Module({
  providers: [BadRequestError, DuplicateKeyError, NotFoundError],
  exports: [BadRequestError, DuplicateKeyError, NotFoundError],
})
export class ErrorsModule {}
