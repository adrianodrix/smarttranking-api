import { IPlayer } from 'src/players/interfaces/player.interface';
import { IResult } from './result-interface';

export interface IMatch {
  category: string;
  players: IPlayer[];
  def: IPlayer;
  result: IResult[];
}
