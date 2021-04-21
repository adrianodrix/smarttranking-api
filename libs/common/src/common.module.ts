import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProxymqModule } from './proxymq/proxymq.module';
import { TranslateModule } from './i18n/i18n.module';
import { AWSModule } from './aws/aws.module';
import { PipesModule } from './pipes/pipes.module';
import { ErrorsModule } from './errors/errors.module';
import { InterceptorsModule } from './interceptors/interceptors.module';
import { FiltersModule } from './filters/filters.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AWSModule,
    ProxymqModule,
    TranslateModule,
    PipesModule,
    ErrorsModule,
    InterceptorsModule,
    FiltersModule,
  ],
  providers: [
    AWSModule,
    ProxymqModule,
    TranslateModule,
    PipesModule,
    ErrorsModule,
    InterceptorsModule,
    FiltersModule,
  ],
  exports: [
    AWSModule,
    ProxymqModule,
    TranslateModule,
    PipesModule,
    ErrorsModule,
    InterceptorsModule,
    FiltersModule,
  ],
})
export class CommonModule {}
