// import { CommandInteraction, SlashCommandBuilder } from "discord.js";
const { SlashCommandBuilder } = require("discord.js");

//const execute = async (interaction: CommandInteraction) => {
const execute = async (interaction) => {

  await interaction.reply("Queueing or playing a song!");
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("song")
    .setDescription("Queue a song."),
  execute,
};
