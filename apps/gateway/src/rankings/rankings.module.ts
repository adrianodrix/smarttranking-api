import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { Module } from '@nestjs/common';
import { RankingsController } from './rankings.controller';

@Module({
  providers: [ClientProxySmartRanking],
  controllers: [RankingsController],
})
export class RankingsModule {}
