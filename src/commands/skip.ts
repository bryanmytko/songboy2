import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { i18n } from "../i18n.config";

const execute = async (
  interaction: ChatInputCommandInteraction,
  _: string,
  player: Player
) => {
  const skipped = player.skip();

  if (skipped) {
    return interaction.reply(i18n.__("commands.skip.reply", skipped.title));
  }

  interaction.reply(i18n.__("commands.skip.empty"));
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.skip.name"))
    .setDescription(i18n.__("commands.skip.desc")),
  execute,
};
