import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { RankingsEvents } from '@lib/models/events/rankings-events.enum';
import { IMatch } from '@lib/models/interfaces/match-interface';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';

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
    const { _id: idMatch } = match;

    this.client.emit(RankingsEvents.PROCESS, { idMatch, match });
  }
}
