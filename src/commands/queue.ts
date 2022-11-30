import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { i18n } from "../i18n.config";

const execute = async (
  interaction: ChatInputCommandInteraction,
  _: string,
  player: Player
) => {
  const queue = player.viewQueue();
  const songs = queue.map((song, index) => `${index + 1}. ${song.title}`);

  interaction.reply(`${i18n.__("commands.queue.reply")} \n${songs.join("\n")}`);
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.queue.name"))
    .setDescription(i18n.__("commands.queue.desc")),
  execute,
};
