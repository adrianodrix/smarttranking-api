import { ChallengeStatus } from '../status/challenge-status.enum';

export interface IChallenge {
  _id?: string;
  startAt: Date;
  status: ChallengeStatus;
  requestAt: Date;
  responseAt: Date;
  applicant: string;
  category: string;
  players: string[];
  match: string;
}
