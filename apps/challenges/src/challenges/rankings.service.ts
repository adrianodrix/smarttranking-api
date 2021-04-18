import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { MatchEvents } from './interfaces/events/category-events.enum';
import { IMatch } from './interfaces/match-interface';

@Injectable()
export class RankingsService {
  private readonly logger: Logger = new Logger(RankingsService.name);
  private client: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly _t: I18nService,
  ) {
    this.client = clientProxySmartRanking.getClientProxyRankingsBackendInstance();
  }

  async processMatch(match: IMatch) {
    this.client.emit(MatchEvents.PROCESS, { match });
  }
}
