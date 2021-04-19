export interface IRanking<T = any> {
  _id?: T;
  challenge: string;
  player: string;
  match: string;
  category: string;
  event: string;
  operation: string;
  points: number;
  createdAt?: Date;
  updatedAt?: Date;
}
