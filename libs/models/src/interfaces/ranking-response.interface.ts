export interface RankingResponse {
  player?: string;
  position?: number;
  points?: number;
  historyMatches?: MatchHistory;
}

export interface MatchHistory {
  victories?: number;
  losses?: number;
}
