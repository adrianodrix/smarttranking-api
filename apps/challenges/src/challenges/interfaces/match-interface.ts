import { IResult } from './result-interface';

export interface IMatch {
  category: string;
  players: string[];
  def: string;
  result: IResult[];
}
