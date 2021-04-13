import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async createOrUpdate(@Body() createPlayerDTO: CreatePlayerDTO) {
    await this.playerService.createOrUpdate(createPlayerDTO);
  }

  @Get()
  async find(@Query('email') email: string): Promise<IPlayer | IPlayer[]> {
    if (email) {
      return await this.playerService.findByEmail(email);
    }
    return await this.playerService.findAll();
  }

  @Delete()
  async delete(@Query('email') email: string): Promise<void> {
    return await this.playerService.deleteByEmail(email);
  }
}
