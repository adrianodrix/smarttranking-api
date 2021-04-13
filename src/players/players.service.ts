import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { IPlayer } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: IPlayer[] = [];

  constructor(private readonly i18n: I18nService) {}

  async createOrUpdate(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    const { email } = createPlayerDTO;
    const playerFound = await this.players.find(
      (player) => player.email === email.toLocaleLowerCase(),
    );
    if (playerFound) {
      await this.update(playerFound, createPlayerDTO);
      return;
    }

    await this.create(createPlayerDTO);
    return;
  }

  async findAll(): Promise<IPlayer[]> {
    if (this.players.length === 0) {
      throw new NotFoundException(
        await this.i18n.translate('player.emptyList'),
      );
    }
    return Promise.resolve(this.players);
  }

  async findByEmail(email: string): Promise<IPlayer> {
    const playerFound = await this.players.find(
      (player) => player.email === email.toLocaleLowerCase(),
    );
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
      _id: uuidv4(),
      email: email.toLocaleLowerCase(),
      ...rest,
      ranking: 'A',
      positionRanking: 1,
      urlAvatar: 'https://i.pravatar.cc/300',
    };
    this.logger.log(`create: ${JSON.stringify(player)}`);

    this.players.push(player);
  }

  private async update(
    playerFound: IPlayer,
    createPlayerDTO: CreatePlayerDTO,
  ): Promise<void> {
    this.logger.log(`update: ${JSON.stringify(createPlayerDTO)}`);

    const { name } = createPlayerDTO;
    playerFound.name = name;
  }

  private async delete(playerFound: IPlayer): Promise<void> {
    this.logger.log(`delete: ${JSON.stringify(playerFound)}`);

    this.players = this.players.filter(
      (player) => player.email !== playerFound.email,
    );
    return;
  }
}
