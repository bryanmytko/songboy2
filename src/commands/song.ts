import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import { i18n } from "../i18n.config";

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("Queueing or playing a song!");
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.song.name"))
    .setDescription(i18n.__("commands.song.desc")),
  execute,
};
