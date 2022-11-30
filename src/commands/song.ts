import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { i18n } from "../i18n.config";
import { Source } from "../types/player";

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string,
  player: Player
) => {
  const song = await player.addSong({
    message: "", // This is for DJ lead
    query,
    source: Source.Request,
  });

  interaction.reply({
    content: i18n.__mf("commands.song.added", song.title),
    ephemeral: true,
  });

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
