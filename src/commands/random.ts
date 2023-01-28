import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { random } from "../models/song";
import { i18n } from "../i18n.config";
import { songService } from "../lib/songService";
import { Source } from "../types/player";

const execute = async (
  interaction: ChatInputCommandInteraction,
  _: string,
  player: Player
) => {
  const record = await random();

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
