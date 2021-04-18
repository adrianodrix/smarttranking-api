import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { Module } from '@nestjs/common';
import { CategoriesModule } from '../categories/categories.module';
import { PlayersModule } from '../players/players.module';
import { ChallengesController } from './challenges.controller';

@Module({
  providers: [ClientProxySmartRanking],
  imports: [PlayersModule, CategoriesModule],
  controllers: [ChallengesController],
})
export class ChallengesModule {}
