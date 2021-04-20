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
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  private logger: Logger = new Logger(NotificationsController.name);

  constructor(private readonly service: NotificationsService) {}

  @EventPattern(ChallengeEvents.NOTIFY)
  async notifyChallenge(
    @Payload() challenge: IChallenge,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    this.logger.log(`notifyChallenge: ${JSON.stringify(challenge)}`);

    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();

    try {
      await this.service.sendEmailToPlayer(challenge);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    } finally {
      channel.ack(originalMessage);
    }
  }
}
