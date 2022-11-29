import { Guild } from "discord.js";

export enum Source {
  Random,
  Reconnect,
  Request,
};

export interface SongParams {
  // guild: Guild;
  // guildId: string;
  message: string;
  query: string;
  source: Source;
  // voiceChannelId: string;
};