import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Logger } from "tslog";

import chat from "../lib/chat";
import Player from "../lib/player";
import { i18n } from "../i18n.config";

require("dotenv").config();

const log: Logger = new Logger();
const CHAT_ENABLED = process.env.CHAT_ENABLED;

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string,
  player: Player
) => {
  if (CHAT_ENABLED !== "true")
    return interaction.reply(i18n.__("commands.chat.off"));

  const completion = await chat(query);

  try {
    player.speech(completion);
    await interaction.deferReply();
    return interaction.editReply(completion || "");
  } catch (e: any) {
    log.error(i18n.__("commands.chat.error"));
    interaction.reply(i18n.__("commands.chat.channelPermission"));
    player.voiceConnection.destroy();
  }
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
