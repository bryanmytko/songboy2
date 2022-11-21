import { CommandInteraction, SlashCommandBuilder } from "discord.js";

const execute = async (interaction: CommandInteraction) => {
  await interaction.reply("Queueing or playing a song!");
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("song")
    .setDescription("Queue a song."),
  execute,
};
