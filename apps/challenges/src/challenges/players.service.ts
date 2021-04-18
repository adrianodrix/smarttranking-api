import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';
import { CategoryEvents } from './interfaces/events/match-events.enum';
import { PlayerEvents } from './interfaces/events/player-events.enum';

@Injectable()
export class PlayersService {
  private readonly logger: Logger = new Logger(PlayersService.name);
  private clientAdminBackend: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
    private readonly _t: I18nService,
  ) {
    this.clientAdminBackend = clientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  async findByListIds(ids: string[]): Promise<any[]> {
    return await this.clientAdminBackend
      .send(PlayerEvents.FIND, { ids })
      .toPromise();
  }

  async findById(id: string): Promise<any> {
    return await this.clientAdminBackend
      .send(PlayerEvents.FIND, { id })
      .toPromise();
  }

  async getCategoryByPlayer(playerId: string) {
    return await this.clientAdminBackend
      .send(CategoryEvents.FIND, { playerId })
      .toPromise();
  }
}
