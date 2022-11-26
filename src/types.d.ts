export interface Command {
  name: string,
  execute: (message: Message, args: Array<string>) => void,
  permissions: Array<PermissionResolvable>,
  aliases: Array<string>,
  cooldown?: number,
}

export enum Source {
  Random,
  Reconnect,
  Request,
}

export interface SongParams {
  guild: Guild;
  guildId: string;
  message: string;
  query: string;
  source: Source;
  voiceChannelId: string;
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>,
  }
}