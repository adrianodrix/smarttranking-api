import { ChallengeStatus } from './challenge-status.enum';

export interface IChallenge {
  startAt: Date;
  status: ChallengeStatus;
  requestAt: Date;
  responseAt: Date;
  applicant: string;
  category: string;
  players: string[];
  match: string;
}
