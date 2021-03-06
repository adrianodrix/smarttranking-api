import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
  RpcException,
} from '@nestjs/microservices';
import { BadRequestError } from '@lib/common/errors/bad-request.error';
import { DuplicateKeyError } from '@lib/common/errors/DuplicateKeyError.error';
import { NotFoundError } from '@lib/common/errors/not-found.error';
import { PlayersService } from './players.service';
import { PlayerEvents } from './interfaces/player-events.enum';
import { IPlayer } from '@lib/models/interfaces/player.interface';

@Controller()
export class PlayersController {
  private logger = new Logger(PlayersController.name);

  constructor(private readonly service: PlayersService) {}

  @EventPattern(PlayerEvents.CREATE)
  async create(@Payload() player: IPlayer, @Ctx() context: RmqContext) {
    this.logger.log(`create: ${JSON.stringify(player)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.service.create(player);
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

  @EventPattern(PlayerEvents.UPDATE)
  async update(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`update: ${JSON.stringify(data)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { id, updatePlayerDTO } = data;
      await this.service.update(id, updatePlayerDTO);
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      if (error instanceof NotFoundError || error instanceof BadRequestError) {
        channel.ack(originalMessage);
      }
      throw new RpcException(error.message);
    }
  }

  @EventPattern(PlayerEvents.DELETE)
  async delete(@Payload() id: string, @Ctx() context: RmqContext) {
    this.logger.log(`delete: ${id}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.service.delete(id);
      channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);

      if (error instanceof NotFoundError) {
        channel.ack(originalMessage);
      }
      throw new RpcException(error.message);
    }
  }

  @MessagePattern(PlayerEvents.FIND)
  async find(@Payload() data: any, @Ctx() context: RmqContext) {
    this.logger.log(`find: ${JSON.stringify(data)}`);
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      const { id, ids, email } = data;

      if (id) {
        return await this.service.findById(id);
      }
      if (ids) {
        return await this.service.findByListIds(ids);
      }
      if (email) {
        return await this.service.findByEmail(email);
      }
      return await this.service.findAll();
    } finally {
      channel.ack(originalMessage);
    }
  }
}
