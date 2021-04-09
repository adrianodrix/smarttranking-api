import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { IPlayer } from './interfaces/player.interface';

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);
  private players: IPlayer[] = [];

  async createOrUpdatePlayer(createPlayerDTO: CreatePlayerDTO): Promise<void> {
    this.create(createPlayerDTO);
  }

  private create(createPlayerDTO: CreatePlayerDTO): void {
    const player: IPlayer = {
      ...createPlayerDTO,
      _id: uuidv4(),
      ranking: 'A',
      positionRanking: 1,
      urlAvatar: 'https://i.pravatar.cc/300',
    };
    this.logger.log(`createOrUpdatePlayer: ${JSON.stringify(player)}`);
    this.players.push(player);
  }
}
