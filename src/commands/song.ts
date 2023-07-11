import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Logger } from "tslog";

import Player from "../lib/player";
import { saveSongHistory } from "../lib/history";
import { i18n } from "../i18n.config";
import { songService } from "../lib/songService";

const log: Logger = new Logger();

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string,
  player: Player
) => {
  const { username } = interaction.user;
  const result = await songService.searchVideos(query);
  const song = { ...result, requester: username };

  try {
    interaction.reply(i18n.__mf("commands.song.added", song.title));
    player.play(song);
    void saveSongHistory(song);
  } catch (e) {
    log.info(
      `Song request failed. Maybe ${username} tried to request a song from a private channel.`
    );
    interaction.reply(i18n.__("commands.song.channelPermission"));
    player.voiceConnection.destroy();
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.song.name"))
    .setDescription(i18n.__("commands.song.desc"))
    .addStringOption((option) =>
      option
        .setName(i18n.__("commands.song.query.name"))
        .setDescription(i18n.__("commands.song.query.desc"))
        .setRequired(true)
    ),
  execute,
};
