import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { I18nService } from 'nestjs-i18n';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { PlayerModel, PlayerDocument } from './models/player.schema';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel(PlayerModel.name)
    private readonly playerModel: Model<PlayerDocument>,
    private readonly i18n: I18nService,
  ) {}

  async createOrUpdate(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;
    const playerFound = await this.playerModel
      .findOne({ email: email.toLocaleLowerCase() })
      .exec();

    if (playerFound) {
      await this.update(playerFound, createPlayerDTO);
      return;
    }

    await this.create(createPlayerDTO);
    return;
  }

  async findAll(): Promise<IPlayer[]> {
    const players = await this.playerModel.find().exec();
    if (players.length === 0) {
      throw new NotFoundException(
        await this.i18n.translate('player.emptyList'),
      );
    }
    return Promise.resolve(players);
  }

  async findByEmail(email: string): Promise<IPlayer> {
    const playerFound = await this.playerModel
      .findOne({ email: email.toLocaleLowerCase() })
      .exec();
    if (!playerFound) {
      throw new NotFoundException(
        await this.i18n.translate('player.notFound', {
          args: { player: email },
        }),
      );
    }
    return Promise.resolve(playerFound);
  }

  async deleteByEmail(email: string): Promise<void> {
    return this.delete(await this.findByEmail(email));
  }

  private async create(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email, ...rest } = createPlayerDTO;

    const player: IPlayer = {
      email: email.toLocaleLowerCase(),
      ...rest,
      ranking: 'A',
      positionRanking: 1,
      urlAvatar: 'https://i.pravatar.cc/300',
    };
    this.logger.log(`create: ${JSON.stringify(player)}`);

    await this.playerModel.create(player);
  }

  private async update(
    playerFound: PlayerDocument,
    createPlayerDTO: CreatePlayerDTO,
  ): Promise<void> {
    this.logger.log(`update: ${JSON.stringify(createPlayerDTO)}`);

    const { name } = createPlayerDTO;
    playerFound.name = name;
    await playerFound.save();
  }

  private async delete(playerFound: IPlayer): Promise<void> {
    this.logger.log(`delete: ${JSON.stringify(playerFound)}`);

    await this.playerModel.deleteOne({ email: playerFound.email }).exec();
  }
}
