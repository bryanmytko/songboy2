import { ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Logger } from "tslog";

import Player from "../lib/player";
import { i18n } from "../i18n.config";

const log: Logger = new Logger();

enum Source {
  Random,
  Reconnect,
  Request,
}

const player = new Player();

const execute = async (
  interaction: ChatInputCommandInteraction,
  message: string
) => {
  const { guild } = interaction;
  const memberId = interaction.member?.user.id || "";

  console.log(message);

  if (!guild) {
    log.error(i18n.__("commands.song.errors.missingGuild"));
    return interaction.reply(i18n.__("commands.song.noGuild"));
  }

  const voiceChannelId =
    guild.members.cache.get(memberId)?.voice.channelId;

  if (!voiceChannelId) {
    return interaction.reply(i18n.__("commands.song.noVoiceChannel"));
  }

  await interaction.reply("Queueing or playing a song!");

  /* TODO placeholder */
  player.addSong({
    input: "Foo Fighters - The Best",
    message: "",
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
        .setName('search')
        .setDescription('Search string.')
        .setRequired(true)),
  execute,
};
