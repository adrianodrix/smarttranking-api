import { Module } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { ChallengesController } from './challenges.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Challenge, ChallengeSchema } from './entities/challenge.entity';
import { Match, MatchSchema } from './entities/match.entity';
import { PlayersService } from './players.service';
import { RankingsService } from './rankings.service';
import { ProxymqModule } from '@lib/common/proxymq/proxymq.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Challenge.name, schema: ChallengeSchema },
      { name: Match.name, schema: MatchSchema },
    ]),
    ProxymqModule,
  ],
  controllers: [ChallengesController],
  providers: [ChallengesService, PlayersService, RankingsService],
})
export class ChallengesModule {}
