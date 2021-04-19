export interface IPlayer<T = any> {
  readonly _id?: T;
  readonly phoneNumber: string;
  readonly email: string;
  name: string;
  ranking: string;
  positionRanking: number;
  urlAvatar: string;
}
