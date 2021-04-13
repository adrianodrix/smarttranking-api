import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IdValidationParamsPipe } from 'src/common/pipes/id-validation-params.pipe';
import { ChallengesService } from './challenges.service';
import { AttachMatchChallengeDto } from './dto/attach-match-challente.dto';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { IChallenge } from './interfaces/challenge.interface';
import { ChallengeStatusValidationPipe } from './pipes/challenge-status-validation.pipe';

@Controller('api/v1/challenges')
export class ChallengesController {
  constructor(private readonly challengesService: ChallengesService) {}

  @Post()
  async create(@Body() createChallengeDto: CreateChallengeDto) {
    return await this.challengesService.create(createChallengeDto);
  }

  @Get()
  async findAll() {
    return await this.challengesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', IdValidationParamsPipe) id: string) {
    return await this.challengesService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id', IdValidationParamsPipe) id: string,
    @Body(ChallengeStatusValidationPipe) updateChallengeDto: UpdateChallengeDto,
  ) {
    return await this.challengesService.update(id, updateChallengeDto);
  }

  @Delete(':id')
  async remove(@Param('id', IdValidationParamsPipe) id: string) {
    return await this.challengesService.remove(id);
  }

  @Get('player/:playerId')
  async getChallengesByPlayer(
    @Param('playerId', IdValidationParamsPipe) playerId: string,
  ): Promise<IChallenge[]> {
    return await this.challengesService.getChallengesByPlayer(playerId);
  }

  @Patch(':id/match')
  async attachMatchInAChallenge(
    @Param('id', IdValidationParamsPipe) _id: string,
    @Body() attachMatchChallengeDto: AttachMatchChallengeDto,
  ): Promise<void> {
    return await this.challengesService.attachMatchInAChallenge(
      _id,
      attachMatchChallengeDto,
    );
  }
}
