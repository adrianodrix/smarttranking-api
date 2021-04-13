import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { AttachMatchChallengeDto } from './dto/attach-match-challente.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge, ChallengeDocument } from './entities/challenge.entity';
import { Match, MatchDocument } from './entities/match.entity';
import { ChallengeStatus } from './interfaces/challenge-status.enum';
import { IChallenge } from './interfaces/challenge.interface';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    @InjectModel(Challenge.name)
    private readonly model: Model<ChallengeDocument>,
    @InjectModel(Match.name)
    private readonly matchModel: Model<MatchDocument>,
    private readonly playerService: PlayersService,
    private readonly categoriesService: CategoriesService,
    private readonly i18n: I18nService,
  ) {}

  async create(createChallengeDto: CreateChallengeDto) {
    this.logger.log(`create: ${createChallengeDto}`);
    const { applicant, players } = createChallengeDto;

    await this.playersExists(players);
    await this.applicantIsValid(applicant, players);

    const categoryByPlayer = await this.getCategoryByPlayer(applicant);
    const newChallenge = new this.model(createChallengeDto);
    newChallenge.category = categoryByPlayer.category;
    newChallenge.status = ChallengeStatus.PENDING;

    return (await newChallenge.save())
      .populate('applicant')
      .populate('players')
      .populate('match')
      .execPopulate();
  }

  async findAll() {
    this.logger.log(`findAll`);

    const challenges = await this.model
      .find()
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec();

    if (challenges.length === 0) {
      throw new NotFoundException(await this.i18n.t('default.emptyList'));
    }

    return challenges;
  }

  async findById(id: string) {
    this.logger.log(`findById: ${id}`);

    const challengeFound = await this.model
      .findById(id)
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec();

    if (!challengeFound) {
      throw new NotFoundException(
        await this.i18n.t('challenges.notFound', {
          args: { challenge: id },
        }),
      );
    }

    return challengeFound;
  }

  async update(_id: string, updateChallengeDto: UpdateChallengeDto) {
    const { status, startAt } = updateChallengeDto;
    const challengeFound = await this.findById(_id);
    if (status) {
      challengeFound.responseAt = new Date();
    }

    challengeFound.status = status;
    challengeFound.startAt = startAt;

    return await this.model
      .findOneAndUpdate(
        { _id },
        { $set: challengeFound },
        { returnOriginal: false },
      )
      .exec();
  }

  async remove(_id: string) {
    const challengeFound = await this.findById(_id);
    challengeFound.status = ChallengeStatus.CANCELED;
    await this.model.findOneAndUpdate({ _id }, { $set: challengeFound }).exec();
  }

  async getChallengesByPlayer(playerId: string): Promise<IChallenge[]> {
    const playerFound = await this.playerService.findById(playerId);
    return await this.model
      .find()
      .where('players')
      .in(playerFound.id)
      .populate('applicant')
      .populate('players')
      .populate('match')
      .exec();
  }

  async attachMatchInAChallenge(
    _id: string,
    attachMatchChallengeDto: AttachMatchChallengeDto,
  ) {
    const challengeFound = await this.findById(_id);
    const defFound = challengeFound.players.filter(
      (player) => player._id == attachMatchChallengeDto.def,
    );
    if (defFound.length === 0) {
      throw new BadRequestException(
        `O jogador vencedor não faz parte do desafio!`,
      );
    }

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
    }
  }

  private async playersExists(players: string[]): Promise<void> {
    const allPlayers = await this.playerService.findByListIds(players);
    if (allPlayers.length !== players.length) {
      throw new BadRequestException('jogadores inválidos');
    }
  }

  private async applicantIsValid(
    applicant: string,
    players: string[],
  ): Promise<void> {
    await this.playerService.findById(applicant);

    const applicantExistsInMatch = players.filter(
      (player) => player === applicant,
    );
    if (applicantExistsInMatch.length === 0) {
      throw new BadRequestException(
        `O solicitante deve ser um jogador da partida!`,
      );
    }
  }

  private async getCategoryByPlayer(playerId: string) {
    const categoryOfPlayer = await this.categoriesService.getCategoryByPlayer(
      playerId,
    );
    if (!categoryOfPlayer) {
      throw new BadRequestException(
        `O solicitante precisa estar registrado em uma categoria!`,
      );
    }
    return categoryOfPlayer;
  }
}
