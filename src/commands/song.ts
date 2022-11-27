import { AttachmentBuilder, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Logger } from "tslog";

import Player from "../lib/player";
import { i18n } from "../i18n.config";
import { Source } from "../types/player";

const log: Logger = new Logger();
const player: Player = new Player();

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string
) => {
  const { guild, channelId } = interaction;
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

  const song = await player.addSong({
    query,
    message: "", // This will be DJ hook. Might just move this inside Player
    source: Source.Request,
    voiceChannelId,
    guildId: guild.id,
    guild,
  });

  //await interaction.reply(`Adding ${song.title} to the playlist`);

  /* Testing image in reply. This currently sends a downloadable empty file */
  const attachment = new AttachmentBuilder(
    song.thumbnail,
    { name: "thumbnail" }
  );

  await interaction.reply({ files: [attachment] });
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
