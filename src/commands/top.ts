import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { i18n } from "../i18n.config";
import { ISongCount, topTen } from "../models/song";

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string
) => {
  const num = Number.parseInt(query);
  if (num > 10 || num < 0)
    return interaction.reply(i18n.__("commands.top.error"));

  const songs = await topTen();

  interaction.reply(
    `${i18n.__mf("commands.top.reply", num)}\n\n${displayTop(
      songs.slice(0, num)
    )}`
  );
};

const displayTop = (songs: ISongCount[]) =>
  songs
    .map(
      (track, index) =>
        `${index + 1}. **${track.title}** requested ${track.count} time${
          track.count === 0 ? "" : "s"
        }`
    )
    .join("\n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.top.name"))
    .setDescription(i18n.__("commands.top.desc"))
    .addStringOption((option) =>
      option
        .setName(i18n.__("commands.top.search.name"))
        .setDescription(i18n.__("commands.top.search.desc"))
        .setRequired(true)
    ),
  execute,
};
