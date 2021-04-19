import { IMatch } from '@lib/models/interfaces/match-interface';

export class CreateRankingDto {
  idMatch: string;
  match: IMatch;
}
