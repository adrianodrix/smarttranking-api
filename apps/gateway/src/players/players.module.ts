import { AWSService } from '@lib/common/aws/aws.service';
import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { Module } from '@nestjs/common';
import { PlayersController } from './players.controller';

@Module({
  providers: [ClientProxySmartRanking, AWSService],
  controllers: [PlayersController],
})
export class PlayersModule {}
