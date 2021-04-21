import { IResult } from './result-interface';

export interface IMatch<T = any> {
  _id?: T;
  category: string;
  challenge: string;
  players: string[];
  def: string;
  result: IResult[];
}
