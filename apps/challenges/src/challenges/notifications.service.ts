import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { ChallengeEvents } from '@lib/models/events/challenge-events.enum';
import { IChallenge } from '@lib/models/interfaces/challenge.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class NotificationsService {
  private readonly logger: Logger = new Logger(NotificationsService.name);
  private client: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {
    this.client = clientProxySmartRanking.getClientProxyNotificationsBackendInstance();
  }

  async notifyChallenge(challenge: IChallenge) {
    this.client.emit(ChallengeEvents.NOTIFY, challenge);
  }
}
