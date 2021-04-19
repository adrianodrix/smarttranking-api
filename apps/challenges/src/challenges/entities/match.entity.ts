import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IMatch } from '../interfaces/match-interface';
import { IResult } from '../interfaces/result-interface';

@Schema({ timestamps: true })
export class Match implements IMatch {
  @Prop()
  category: string;

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