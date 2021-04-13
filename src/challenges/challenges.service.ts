import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { CategoriesService } from 'src/categories/categories.service';
import { PlayersService } from 'src/players/players.service';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { Challenge, ChallengeDocument } from './entities/challenge.entity';
import { Match, MatchDocument } from './entities/match.entity';
import { ChallengeStatus } from './interfaces/challenge-status.enum';

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(
    @InjectModel(Challenge.name)
    private readonly model: Model<ChallengeDocument>,
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

  findAll() {
    return `This action returns all challenges`;
  }

  findOne(id: number) {
    return `This action returns a #${id} challenge`;
  }

  update(id: number, updateChallengeDto: UpdateChallengeDto) {
    return `This action updates a #${id} challenge`;
  }

  remove(id: number) {
    return `This action removes a #${id} challenge`;
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
