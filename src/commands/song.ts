import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Logger } from "tslog";

import Player from "../lib/player";
import { i18n } from "../i18n.config";

const log: Logger = new Logger();
const player: Player = new Player();

enum Source {
  Random,
  Reconnect,
  Request,
}

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string
) => {
  const { guild } = interaction;
  const memberId = interaction.member?.user.id || "";

  if (!guild) {
    log.error(i18n.__("commands.song.errors.missingGuild"));
    return interaction.reply(i18n.__("commands.song.noGuild"));
  }

  const voiceChannelId =
    guild.members.cache.get(memberId)?.voice.channelId;

  if (!voiceChannelId) {
    return interaction.reply(i18n.__("commands.song.noVoiceChannel"));
  }

  /* This should instead display the reult of the query.
     We can accomplish this by either passing interaction and having the
     reply trigger within `addSong` or use a return value. */
  await interaction.reply(`Adding ${query} to the playlist`);

  /* TODO placeholder */
  player.addSong({
    query,
    message: "", // This will be DJ hook. Might just move this inside Player
    source: Source.Request,
    voiceChannelId,
    guildId: guild.id,
    guild,
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.song.name"))
    .setDescription(i18n.__("commands.song.desc"))
    .addStringOption(option =>
      option
        .setName(i18n.__("commands.song.search.name"))
        .setDescription(i18n.__("commands.song.search.desc"))
        .setRequired(true)),
  execute,
};
