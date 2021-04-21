import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { PlayerEvents } from '@lib/models/events/player-events.enum';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { I18nService } from 'nestjs-i18n';

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
  async findById(id: string): Promise<any> {
    return await this.clientAdminBackend
      .send(PlayerEvents.FIND, { id })
      .toPromise();
  }
}
