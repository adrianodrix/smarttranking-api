import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class PlayerModel {
  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  ranking: string;

  @Prop()
  positionRanking: number;

  @Prop()
  urlAvatar: string;
}

export type PlayerDocument = PlayerModel & Document;
export const PlayerSchema = SchemaFactory.createForClass(PlayerModel);
