export enum Source {
  Random,
  Reconnect,
  Request,
};

export interface SongParams {
  message: string;
  query: string;
  source: Source;
};