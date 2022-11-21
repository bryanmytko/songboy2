
export interface Command {
  name: string,
  execute: (message: Message, args: Array<string>) => void,
  permissions: Array<PermissionResolvable>,
  aliases: Array<string>,
  cooldown?: number,
}

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>,
  }
}