import { Module } from '@nestjs/common';
import { IdValidationParamsPipe } from './id-validation-params.pipe';
import { ValidationBodyPipe } from './validation-body.pipe';
import { ValidationParamsPipe } from './validation-params.pipe';

@Module({
  providers: [IdValidationParamsPipe, ValidationBodyPipe, ValidationParamsPipe],
  exports: [IdValidationParamsPipe, ValidationBodyPipe, ValidationParamsPipe],
})
export class PipesModule {}
