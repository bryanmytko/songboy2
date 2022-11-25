import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { i18n } from "../i18n.config";

const player = new Player();

const execute = async (interaction: CommandInteraction) => {
  console.log(interaction)
  /* TODO guildId should pass to Player instead of relying on interaction */
  const { guildId } = interaction;

  const memberId = interaction.member?.user.id || '';
  const voiceChannelId = interaction
    .guild?.members.cache.get(memberId)?.voice.channelId;

  await interaction.reply("Queueing or playing a song!");

  /* TODO placeholder */
  player.addSong({
    input: "Foo Fighters - The Best",
    message: "This one is great! ",
    source: "Input",
    voiceChannelId,
    interaction
  });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.song.name"))
    .setDescription(i18n.__("commands.song.desc")),
  execute,
};
