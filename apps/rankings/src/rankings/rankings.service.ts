import { EventName } from '@lib/models/events/event-name.enum';
import { ICategory, IEvent } from '@lib/models/interfaces/category.interface';
import { IMatch } from '@lib/models/interfaces/match-interface';
import {
  MatchHistory,
  RankingResponse,
} from '@lib/models/interfaces/ranking-response.interface';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as momentTimeZone from 'moment-timezone';
import { CategoriesService } from './categories.service';
import { CreateRankingDto } from './dto/create-ranking.dto';
import { Ranking, RankingDocument } from './entities/ranking.entity';
import { ChallengesService } from './challenges.service';
import { IChallenge } from '@lib/models/interfaces/challenge.interface';
import * as _ from 'lodash';

@Injectable()
export class RankingsService {
  private logger: Logger = new Logger(RankingsService.name);

  constructor(
    @InjectModel(Ranking.name)
    private readonly model: Model<RankingDocument>,
    private readonly categoriesService: CategoriesService,
    private readonly challengesService: ChallengesService,
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
    this.logger.log(`categoryFound: ${JSON.stringify(categoryFound)}`);
    await Promise.all(
      players.map(async (player) => {
        await this.create(player, categoryFound, createRankingDto.match);
      }),
    );
  }

  async find(
    categoryId: string,
    dateRef = '',
  ): Promise<RankingResponse[] | RankingResponse> {
    // TODO: - Get registers using mongodb agregation
    // Class: https://www.udemy.com/course/construindo-um-backend-escalavel-com-nestjs-aws-e-pivotalws/learn/lecture/21989840#overview

    this.logger.log(`find: ${categoryId}, ${dateRef}`);

    const registers = await this.model
      .find()
      .where('category')
      .equals(categoryId)
      .exec();
    this.logger.log(`registers: ${JSON.stringify(registers)}`);

    const challenges: IChallenge[] = await this.challengesService.findByDate(
      categoryId,
      dateRef,
    );
    this.logger.log(`challenges: ${JSON.stringify(challenges)}`);

    _.remove(registers, function (item) {
      return (
        challenges.filter((challenge) => challenge._id == item.challenge)
          .length === 0
      );
    });
    this.logger.log(`new registers: ${JSON.stringify(registers)}`);

    let result = _(registers)
      .groupBy('player')
      .map((items, key) => ({
        player: key,
        historical: _.countBy(items, 'event'),
        points: _.sumBy(items, 'points'),
      }))
      .value();

    result = _.orderBy(result, 'points', 'desc');

    this.logger.log(`#1 result: ${JSON.stringify(result)}`);

    const rankingResponseList: RankingResponse[] = [];
    result.map(function (item, index) {
      const { player, points, historical } = item;
      const rankingResponse: RankingResponse = {};
      rankingResponse.player = player;
      rankingResponse.position = index + 1;
      rankingResponse.points = points;

      const historicalMatches: MatchHistory = {};
      historicalMatches.victories = historical[EventName.VICTORY]
        ? historical[EventName.VICTORY]
        : 0;
      historicalMatches.losses = historical[EventName.LOSS]
        ? historical[EventName.LOSS]
        : 0;
      rankingResponse.historyMatches = historicalMatches;

      rankingResponseList.push(rankingResponse);
    });

    return rankingResponseList;
  }

  private async create(player: string, category: ICategory, match: IMatch) {
    const { _id: matchId, challenge } = match;
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
    ranking.challenge = challenge;
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
