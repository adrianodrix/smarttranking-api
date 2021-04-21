import { IPlayer } from '@lib/models/interfaces/player.interface';

export interface ICategory<T = any> {
  _id?: T;
  readonly category: string;
  description: string;
  events: IEvent[];
  players: IPlayer[];
}

export interface IEvent {
  name: string;
  operation: string;
  value: number;
}
