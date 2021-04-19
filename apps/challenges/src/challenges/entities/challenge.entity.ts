import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChallengeStatus } from '../interfaces/challenge-status.enum';
import { IChallenge } from '../interfaces/challenge.interface';
import { MatchDocument } from './match.entity';

@Schema({ timestamps: true })
export class Challenge implements IChallenge {
  @Prop()
  startAt: Date;

  @Prop({ type: String })
  status: ChallengeStatus;

  @Prop({ default: new Date() })
  requestAt: Date;

  @Prop()
  responseAt: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  applicant: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ])
  players: string[];

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
  })
  match: string;
}

export type ChallengeDocument = Challenge & mongoose.Document;
export const ChallengeSchema = SchemaFactory.createForClass(Challenge);
