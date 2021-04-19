import { EventName } from '@lib/models/events/event-name.enum';
import { ICategory, IEvent } from '@lib/models/interfaces/category.interface';
import { IMatch } from '@lib/models/interfaces/match-interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CategoriesService } from './categories.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { Ranking, RankingDocument } from './entities/ranking.entity';

@Injectable()
export class RankingsService {
  private logger: Logger = new Logger(RankingsService.name);

  constructor(
    @InjectModel(Ranking.name)
    private readonly model: Model<RankingDocument>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async processMatch(
    id: string,
    createRankingDto: CreateRankingDto,
  ): Promise<void> {
    this.logger.log(
      `This action process a #${id} ranking: ${JSON.stringify(
        createRankingDto,
      )}`,
    );

    const { players, category: categoryId } = createRankingDto.match;
    const categoryFound: ICategory = await this.categoriesService.findById(
      categoryId,
    );

    await Promise.all(
      players.map(async (player) => {
        await this.create(player, categoryFound, createRankingDto.match);
      }),
    );
  }

  private async create(player: string, category: ICategory, match: IMatch) {
    const { _id: matchId } = match;
    const { _id: categoryId, events } = category;

    let event: IEvent;
    if (player === match.def) {
      event = this.getEventByName(events, EventName.VICTORY);
    } else {
      event = this.getEventByName(events, EventName.LOSS);
    }
    const { name, operation, value } = event;

    const ranking: RankingDocument = new this.model();

    ranking.category = categoryId;
    ranking.match = matchId;
    ranking.player = player;
    ranking.event = name;
    ranking.operation = operation;
    ranking.points = value;

    this.logger.log(`Ranking: ${JSON.stringify(ranking)}`);
    await ranking.save();
  }

  private getEventByName(events: IEvent[], name: string): IEvent {
    return events.filter((event) => event.name === name)[0];
  }
}
