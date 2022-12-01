import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { i18n } from "../i18n.config";

const execute = async (
  interaction: ChatInputCommandInteraction,
  _: string,
  player: Player
) => {
  player.stop();
  return interaction.reply(i18n.__("commands.stop.reply"));
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.stop.name"))
    .setDescription(i18n.__("commands.stop.desc")),
  execute,
};