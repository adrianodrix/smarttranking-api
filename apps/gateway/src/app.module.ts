import { Module } from '@nestjs/common';
import { CommonModule } from '@lib/common/common.module';
import { ProxymqModule } from '@lib/common/proxymq/proxymq.module';
import { CategoriesModule } from './categories/categories.module';
import { PlayersModule } from './players/players.module';
import { ChallengesModule } from './challenges/challenges.module';
import { RankingsModule } from './rankings/rankings.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    CommonModule,
    ProxymqModule,
    CategoriesModule,
    PlayersModule,
    ChallengesModule,
    RankingsModule,
    AuthModule,
  ],
})
export class AppModule {}
