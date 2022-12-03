import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { i18n } from "../i18n.config";
import { Source } from "../types/player";

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string,
  player: Player
) => {
  const { username } = interaction.user;

  const song = await player.addSong({
    requester: username,
    query,
    source: Source.Request,
  });

  interaction.reply(i18n.__mf("commands.song.added", song.title));

  player.addToQueue(song);
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
