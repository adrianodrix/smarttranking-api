import { IPlayer } from 'src/players/interfaces/player.interface';
import { ChallengeStatus } from './challenge-status.enum';
import { IMatch } from './match-interface';

export interface IChallenge {
  startAt: Date;
  status: ChallengeStatus;
  requestAt: Date;
  responseAt: Date;
  applicant: IPlayer;
  category: string;
  players: IPlayer[];
  match: IMatch;
}
