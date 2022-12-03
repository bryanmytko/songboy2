export enum Source {
  Random,
  Reconnect,
  Request,
}

export interface SongParams {
  query: string;
  requester: string;
  source: Source;
}

export interface Song {
  requester: string;
  thumbnail: string;
  title: string;
  videoId: string;
}
