import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';

@Module({
  providers: [ClientProxySmartRanking],
  controllers: [CategoriesController],
})
export class CategoriesModule {}
