import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { UpdatePlayerDTO } from './dto/update-player.dto';
import { IPlayer } from './interfaces/player.interface';
import { PlayerValidationParamsPipe } from './pipes/player-validation-params.pipe';
import { IdValidationParamsPipe } from '../common/pipes/id-validation-params.pipe';
import { PlayersService } from './players.service';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Post()
  async create(@Body() createPlayerDTO: CreatePlayerDTO): Promise<IPlayer> {
    return await this.playerService.create(createPlayerDTO);
  }

  @Patch(':id')
  async update(
    @Param('id', IdValidationParamsPipe) id: string,
    @Body() updatePlayerDTO: UpdatePlayerDTO,
  ): Promise<IPlayer> {
    return await this.playerService.update(id, updatePlayerDTO);
  }

  @Get()
  async findAll(): Promise<IPlayer[]> {
    return await this.playerService.findAll();
  }

  @Get('email/:email')
  async findByEmail(
    @Param('email', PlayerValidationParamsPipe) email: string,
  ): Promise<IPlayer> {
    return await this.playerService.findByEmail(email);
  }

  @Get(':id')
  async findById(
    @Param('id', IdValidationParamsPipe) id: string,
  ): Promise<IPlayer> {
    return await this.playerService.findById(id);
  }

  @Delete(':id')
  async delete(@Param('id', IdValidationParamsPipe) id: string): Promise<void> {
    return await this.playerService.delete(id);
  }
}
