import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { IPlayer } from 'src/players/interfaces/player.interface';
import { IMatch } from '../interfaces/match-interface';
import { IResult } from '../interfaces/result-interface';

@Schema({ timestamps: true })
export class Match implements IMatch {
  @Prop()
  category: string;

  @Prop([
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
    },
  ])
  players: IPlayer[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Player' })
  def: IPlayer;

  @Prop([{ set: { type: String } }])
  result: IResult[];
}

export type MatchDocument = Match & mongoose.Document;
export const MatchSchema = SchemaFactory.createForClass(Match);
