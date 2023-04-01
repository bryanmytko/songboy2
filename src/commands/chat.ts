import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Logger } from "tslog";

import { i18n } from "../i18n.config";

const log: Logger = new Logger();

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string
) => {
  log.info("Chat input:", query);

  interaction.reply(`Okay, got it: ${query}`);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.chat.name"))
    .setDescription(i18n.__("commands.chat.desc"))
    .addStringOption((option) =>
      option
        .setName(i18n.__("commands.chat.query.name"))
        .setDescription(i18n.__("commands.chat.query.desc"))
        .setRequired(true)
    ),
  execute,
};
