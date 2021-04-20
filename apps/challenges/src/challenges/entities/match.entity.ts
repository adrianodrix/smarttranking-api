import { IMatch } from '@lib/models/interfaces/match-interface';
import { IResult } from '@lib/models/interfaces/result-interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Match implements IMatch {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  challenge: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ])
  players: string[];

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  def: string;

  @Prop([{ set: { type: String } }])
  result: IResult[];
}

export type MatchDocument = Match & mongoose.Document;
export const MatchSchema = SchemaFactory.createForClass(Match);
