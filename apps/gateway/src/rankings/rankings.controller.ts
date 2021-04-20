import { IdValidationParamsPipe } from '@lib/common/pipes/id-validation-params.pipe';
import { ClientProxySmartRanking } from '@lib/common/proxymq/client-proxy';
import { RankingsEvents } from '@lib/models/events/rankings-events.enum';
import { Controller, Get, Logger, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Controller('api/v1/rankings')
export class RankingsController {
  private logger: Logger = new Logger(RankingsController.name);
  private client: ClientProxy;

  constructor(
    private readonly clientProxySmartRanking: ClientProxySmartRanking,
  ) {
    this.client = clientProxySmartRanking.getClientProxyRankingsBackendInstance();
  }

  @Get()
  find(
    @Query('categoryId', IdValidationParamsPipe) categoryId: string,
    @Query('dateRef') dateRef?: string,
  ): Observable<any> {
    this.logger.log(`find: ${categoryId}, ${dateRef}`);
    return this.client.send(RankingsEvents.FIND, { categoryId, dateRef });
  }
}
