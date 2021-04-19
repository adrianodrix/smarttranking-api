import { IRanking } from '@lib/models/interfaces/ranking.interface';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Ranking implements IRanking {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  challenge: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  player: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  match: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId })
  category: string;

  @Prop()
  event: string;

  @Prop()
  operation: string;

  @Prop()
  points: number;
}

export type RankingDocument = Ranking & mongoose.Document;
export const RankingSchema = SchemaFactory.createForClass(Ranking);
