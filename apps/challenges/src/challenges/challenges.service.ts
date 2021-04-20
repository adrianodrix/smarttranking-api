import { BadRequestError } from '@lib/common/errors/bad-request.error';
import { IChallenge } from '@lib/models/interfaces/challenge.interface';
import { IMatch } from '@lib/models/interfaces/match-interface';
import { ChallengeStatus } from '@lib/models/status/challenge-status.enum';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Challenge, ChallengeDocument } from './entities/challenge.entity';
import { Match, MatchDocument } from './entities/match.entity';
import { PlayersService } from './players.service';
import { RankingsService } from './rankings.service';
import * as momentTimeZone from 'moment-timezone';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);
  private readonly categoriesService: any;

  constructor(
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>,
    @InjectModel(Challenge.name)
    private readonly modelChallenge: Model<ChallengeDocument>,
    private readonly playerService: PlayersService,
    private readonly rankingsService: RankingsService,
  ) {}

  async create(createChallengeDto: IChallenge): Promise<void> {
    this.logger.log(`create: ${JSON.stringify(createChallengeDto)}`);
    const { applicant, players } = createChallengeDto;

    await this.playersExists(players);
    await this.applicantIsValid(applicant, players);

    const categoryByPlayer = await this.getCategoryByPlayer(applicant);
    this.logger.log(`categoryByPlayer: ${JSON.stringify(categoryByPlayer)}`);

    const newChallenge = new this.modelChallenge(createChallengeDto);
    newChallenge.category = categoryByPlayer._id;
    newChallenge.status = ChallengeStatus.PENDING;

    await newChallenge.save();
  }

  async findAll() {
    this.logger.log(`findAll`);

    return await this.modelChallenge.find().lean();
  }

  async findById(id: string) {
    this.logger.log(`Challenge findById: ${id}`);
    return await this.modelChallenge.findById(id).exec();
  }

  async update(_id: string, updateChallengeDto: IChallenge) {
    const { status, startAt } = updateChallengeDto;

    return await this.modelChallenge
      .findOneAndUpdate({ _id }, { $set: { startAt, status } })
      .exec();
  }

  async remove(_id: string) {
    await this.modelChallenge
      .findOneAndUpdate({ _id }, { $set: { status: ChallengeStatus.CANCELED } })
      .exec();
  }

  async getChallengesByPlayer(playerId: string): Promise<IChallenge[]> {
    this.logger.log(`getChallengesByPlayer: ${playerId}`);

    const playerFound = await this.playerService.findById(playerId);
    return await this.modelChallenge
      .find()
      .where('players')
      .in(playerFound._id)
      .lean();
  }

  async getMatchById(id: string): Promise<IMatch> {
    this.logger.log(`getMatchById: #${id}`);
    return await this.matchModel.findById(id).exec();
  }

  async attachMatchInAChallenge(
    challengeId: string,
    attachMatchChallengeDto: any,
  ) {
    this.logger.log(
      `attachMatchInAChallenge: #${challengeId}, data: ${JSON.stringify(
        attachMatchChallengeDto,
      )}`,
    );
    const challengeFound = await this.findById(challengeId);
    const defFound = challengeFound.players.filter(
      (player) => player['_id'] == attachMatchChallengeDto.def,
    );
    if (defFound.length === 0) {
      throw new BadRequestError(`O jogador vencedor não faz parte do desafio!`);
    }
    const oldMatch = challengeFound.match ?? challengeFound.match;

    const newMatch = new this.matchModel(attachMatchChallengeDto);
    newMatch.category = challengeFound.category;
    newMatch.players = challengeFound.players;
    newMatch.challenge = challengeFound._id;
    const resultMatch = await newMatch.save();

    challengeFound.status = ChallengeStatus.ACHIEVED;
    challengeFound.match = resultMatch.id;

    try {
      this.logger.log(`challengeFound: ${JSON.stringify(challengeFound)}`);
      await this.modelChallenge
        .findOneAndUpdate({ _id: challengeId }, { $set: challengeFound })
        .exec();

      this.rankingsService.processMatch(resultMatch);
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      await this.matchModel.deleteOne({ _id: resultMatch.id }).exec();
      throw new InternalServerErrorException();
    } finally {
      if (oldMatch) {
        this.matchModel.deleteOne({ _id: oldMatch }).exec();
      }
    }
  }

  async getChallengesByDateRef(
    categoryId: string,
    dateRef: string,
  ): Promise<IChallenge[]> {
    this.logger.log(
      `getChallengesByDateRef: categoryId ${categoryId}, dateRef ${dateRef} `,
    );
    const dateRefNew = `${dateRef} 23:59:59.999`;
    const dateFormated: number = momentTimeZone(dateRefNew)
      .tz('UTC')
      .toDate()
      .getTime();

    this.logger.log(`dateFormated: ${dateFormated.toLocaleString()}`);

    return await this.modelChallenge
      .find()
      .where('category')
      .equals(categoryId)
      .where('status')
      .equals(ChallengeStatus.ACHIEVED)
      .where('startAt')
      .lte(dateFormated)
      .exec();
  }

  async getChallengesByCategoryWithStatusRealized(
    categoryId: string,
  ): Promise<IChallenge[]> {
    this.logger.log(`getChallengesByCategoryWithStatusRealized: ${categoryId}`);
    return await this.modelChallenge
      .find()
      .where('category')
      .equals(categoryId)
      .where('status')
      .equals(ChallengeStatus.ACHIEVED)
      .exec();
  }
  private async playersExists(players: string[]): Promise<void> {
    this.logger.log(`playersExists: ${JSON.stringify(players)}`);

    const allPlayers = await this.playerService.findByListIds(players);
    if (allPlayers.length !== players.length) {
      throw new BadRequestError('jogadores inválidos');
    }
  }

  private async applicantIsValid(
    applicant: string,
    players: string[],
  ): Promise<void> {
    this.logger.log(
      `applicantIsValid: ${applicant}, players: ${JSON.stringify(players)}`,
    );

    if (!(await this.playerService.findById(applicant))) {
      throw new BadRequestError(
        `Solicitante ${applicant} não pode ser encontrado`,
      );
    }

    const applicantExistsInMatch = players.filter(
      (player) => player === applicant,
    );
    if (applicantExistsInMatch.length === 0) {
      throw new BadRequestError(
        `O solicitante deve ser um jogador da partida!`,
      );
    }
  }

  private async getCategoryByPlayer(playerId: string) {
    this.logger.log(`getCategoryByPlayer: ${playerId}`);

    const categoryOfPlayer = await this.playerService.getCategoryByPlayer(
      playerId,
    );

    if (!categoryOfPlayer) {
      throw new BadRequestError(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }
    return categoryOfPlayer;
  }
}
