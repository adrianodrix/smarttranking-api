import { BadRequestError } from '@lib/common/errors/bad-request.error';
import { DuplicateKeyError } from '@lib/common/errors/DuplicateKeyError.error';
import { NotFoundError } from '@lib/common/errors/not-found.error';
import { ChallengeEvents } from '@lib/models/events/challenge-events.enum';
import { IChallenge } from '@lib/models/interfaces/challenge.interface';
import { Controller, Logger } from '@nestjs/common';

import {
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { ChallengesService } from './challenges.service';

@Controller('api/v1/challenges')
export class ChallengesController {
  private logger: Logger = new Logger(ChallengesController.name);

  constructor(private readonly service: ChallengesService) {}

  @EventPattern(ChallengeEvents.CREATE)
  async create(
    @Payload() createChallengeDto: IChallenge,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log(`create: ${JSON.stringify(createChallengeDto)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.service.create(createChallengeDto);
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      if (
        error instanceof DuplicateKeyError ||
        error instanceof BadRequestError
      ) {
        channel.ack(originalMessage);
      }
      throw new RpcException(error.message);
    }
  }

  @EventPattern(ChallengeEvents.FIND)
  async find(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`find: ${JSON.stringify(data)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { id, playerId, matchId, categoryId, dateRef } = data;

      if (id) {
        return await this.service.findById(id);
      }

      if (playerId) {
        return await this.service.getChallengesByPlayer(playerId);
      }

      if (matchId) {
        return await this.service.getMatchById(matchId);
      }

      if (categoryId && !dateRef) {
        return await this.service.getChallengesByCategoryWithStatusRealized(
          categoryId,
        );
      }

      if (categoryId && dateRef) {
        return await this.service.getChallengesByDateRef(categoryId, dateRef);
      }

      return await this.service.findAll();
    } finally {
      channel.ack(originalMessage);
    }
  }

  @EventPattern(ChallengeEvents.UPDATE)
  async update(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`update: ${JSON.stringify(data)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { id, updateChallengeDto, attachMatchChallengeDto } = data;
      if (updateChallengeDto) {
        await this.service.update(id, updateChallengeDto);
      }
      if (attachMatchChallengeDto) {
        await this.service.attachMatchInAChallenge(id, attachMatchChallengeDto);
      }
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      /*
      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        channel.ack(originalMessage);
      }
      */

      channel.ack(originalMessage);
      throw new RpcException(error.message);
    }
  }

  @EventPattern(ChallengeEvents.DELETE)
  async delete(@Payload() id: string, @Ctx() context: RmqContext) {
    this.logger.log(`delete: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.service.remove(id);
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      if (error instanceof NotFoundError) {
        channel.ack(originalMessage);
      }
      throw new RpcException(error.message);
    }
  }
}
