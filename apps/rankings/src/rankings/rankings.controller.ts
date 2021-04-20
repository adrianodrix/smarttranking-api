import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { RankingsService } from './rankings.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { RankingsEvents } from '@lib/models/events/rankings-events.enum';
import { RankingResponse } from '@lib/models/interfaces/ranking-response.interface';

@Controller()
export class RankingsController {
  private logger: Logger = new Logger(RankingsController.name);

  constructor(private readonly rankingsService: RankingsService) {}

  @EventPattern(RankingsEvents.PROCESS)
  async processMatch(
    @Payload() createRankingDto: CreateRankingDto,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`processMatch: ${JSON.stringify(createRankingDto)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { idMatch } = createRankingDto;
      await this.rankingsService.processMatch(idMatch, createRankingDto);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMessage);
    }
  }

  @MessagePattern(RankingsEvents.FIND)
  async find(
    @Payload() data: { categoryId: string; dateRef: string },
    @Ctx() context: RmqContext,
  ): Promise<RankingResponse[] | RankingResponse> {
    this.logger.log(`find: ${JSON.stringify(data)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { categoryId, dateRef } = data;
      return await this.rankingsService.find(categoryId, dateRef);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMessage);
    }
  }
}
