import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { Song } from "../models/song";
import { i18n } from "../i18n.config";
import { songService } from "../lib/songService";
import { Source } from "../types/player";

const execute = async (
  interaction: ChatInputCommandInteraction,
  _: string,
  player: Player
) => {
  const record = await randomRecord();
  if (!record) return interaction.reply(i18n.__("commands.random.empty"));

  const { requester, url } = record;
  const result = await songService.searchVideos(url);
  const song = {
    ...result,
    requester,
    source: Source.Random,
  };

  interaction.reply(i18n.__mf("commands.random.added", song.title));
  player.play(song);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.random.name"))
    .setDescription(i18n.__("commands.random.desc")),
  execute,
};

const randomRecord = async () => {
  const count = await Song.countDocuments();
  const random = Math.floor(Math.random() * count);
  return Song.findOne().skip(random);
};
