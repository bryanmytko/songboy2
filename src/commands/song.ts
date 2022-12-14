import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { saveSongHistory } from "../lib/history";
import { i18n } from "../i18n.config";
import { songService } from "../lib/songService";

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string,
  player: Player
) => {
  const { username } = interaction.user;
  const result = await songService.searchVideos(query);
  const song = { ...result, requester: username };

  interaction.reply(i18n.__mf("commands.song.added", song.title));
  player.play(song);
  void saveSongHistory(song);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.song.name"))
    .setDescription(i18n.__("commands.song.desc"))
    .addStringOption((option) =>
      option
        .setName(i18n.__("commands.song.search.name"))
        .setDescription(i18n.__("commands.song.search.desc"))
        .setRequired(true)
    ),
  execute,
};
