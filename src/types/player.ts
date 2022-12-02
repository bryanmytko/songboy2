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

export interface Song {
  videoId: string;
  title: string;
  thumbnail: string;
};