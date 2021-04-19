import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { CategoryEvents } from '@lib/models/events/category-events.enum';
import { Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class CategoriesService {
  private readonly logger: Logger = new Logger(CategoriesService.name);
  private clientAdminBackend: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {
    this.clientAdminBackend = clientProxySmartRanking.getClientProxyAdminBackendInstance();
  }

  async findById(id: string): Promise<any> {
    return await this.clientAdminBackend
      .send(CategoryEvents.FIND, id)
      .toPromise();
  }
}
