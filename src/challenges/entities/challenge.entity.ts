import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';
import { IChallenge } from '../interfaces/challenge.interface';
import { IMatch } from '../interfaces/match-interface';

@Schema({ timestamps: true })
export class Challenge implements IChallenge {
  @Prop()
  startAt: Date;

  @Prop()
  status: ChallengeStatus;

  @Prop({ default: new Date() })
  requestAt: Date;

  @Prop()
  responseAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Player' })
  applicant: IPlayer;

  @Prop()
  category: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ])
  players: IPlayer[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  })
  match: IMatch;
}

export type ChallengeDocument = Challenge & mongoose.Document;
export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
