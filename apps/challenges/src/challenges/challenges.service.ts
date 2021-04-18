import { BadRequestError } from '@lib/common/errors/bad-request.error';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { Challenge, ChallengeDocument } from './entities/challenge.entity';
import { Match, MatchDocument } from './entities/match.entity';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { IChallenge } from './interfaces/challenge.interface';
import { IMatch } from './interfaces/match-interface';
import { PlayersService } from './players.service';
import { RankingsService } from './rankings.service';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);
  private readonly categoriesService: any;

  constructor(
    @InjectModel(Challenge.name)
    private readonly model: Model<ChallengeDocument>,
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>,
    private readonly playerService: PlayersService,
    private readonly rankingsService: RankingsService,
    private readonly i18n: I18nService,
  ) {}

  async create(createChallengeDto: IChallenge): Promise<void> {
    this.logger.log(`create: ${JSON.stringify(createChallengeDto)}`);
    const { applicant, players } = createChallengeDto;

    await this.playersExists(players);
    await this.applicantIsValid(applicant, players);

    const categoryByPlayer = await this.getCategoryByPlayer(applicant);
    this.logger.log(`categoryByPlayer: ${JSON.stringify(categoryByPlayer)}`);

    const newChallenge = new this.model(createChallengeDto);
    newChallenge.category = categoryByPlayer._id;
    newChallenge.status = ChallengeStatus.PENDING;

    await newChallenge.save();
  }

  async findAll() {
    this.logger.log(`findAll`);

    return await this.model.find().lean();
  }

  async findById(id: string) {
    this.logger.log(`findById: ${id}`);

    return await this.model.findById(id).lean();
  }

  async update(_id: string, updateChallengeDto: IChallenge) {
    const { status, startAt } = updateChallengeDto;

    return await this.model
      .findOneAndUpdate({ _id }, { $set: { startAt, status } })
      .exec();
  }

  async remove(_id: string) {
    await this.model
      .findOneAndUpdate({ _id }, { $set: { status: ChallengeStatus.CANCELED } })
      .exec();
  }

  async getChallengesByPlayer(playerId: string): Promise<IChallenge[]> {
    this.logger.log(`getChallengesByPlayer: ${playerId}`);

    const playerFound = await this.playerService.findById(playerId);
    return await this.model.find().where('players').in(playerFound._id).lean();
  }

  async getMatchById(id: string): Promise<IMatch> {
    return await this.matchModel.findById(id);
  }

  async attachMatchInAChallenge(_id: string, attachMatchChallengeDto: any) {
    const challengeFound = await this.findById(_id);
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
    const resultMatch = await newMatch.save();

    challengeFound.status = ChallengeStatus.ACHIEVED;
    challengeFound.match = resultMatch.id;
    try {
      await this.model
        .findOneAndUpdate({ _id }, { $set: challengeFound })
        .exec();
    } catch (error) {
      this.logger.error(JSON.stringify(error));
      await this.matchModel.deleteOne({ _id: resultMatch.id }).exec();
      throw new InternalServerErrorException();
    } finally {
      if (oldMatch) {
        this.matchModel.deleteOne({ _id: oldMatch.id }).exec();
      }
    }
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
