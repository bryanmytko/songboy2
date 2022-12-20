export enum Source {
  Random,
  Reconnect,
  Request,
}

export interface Song {
  requester: string;
  source?: Source;
  thumbnail: string;
  title: string;
  videoId: string;
}
