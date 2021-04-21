import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { CategoryEvents } from '@lib/models/events/category-events.enum';
import { ChallengeEvents } from '@lib/models/events/challenge-events.enum';
import { IChallenge } from '@lib/models/interfaces/challenge.interface';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ChallengesService {
  private readonly logger: Logger = new Logger(ChallengesService.name);
  private client: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {
    this.client = clientProxySmartRanking.getClientProxyChallengesBackendInstance();
  }

  async findByDate(categoryId: string, dateRef: string): Promise<IChallenge[]> {
    return await this.client
      .send(ChallengeEvents.FIND, { categoryId, dateRef })
      .toPromise();
  }
}
