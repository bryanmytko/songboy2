import { CommandInteraction, SlashCommandBuilder } from "discord.js";

import Player from "../lib/player";
import { i18n } from "../i18n.config";

const player = new Player();

const execute = async (interaction: CommandInteraction) => {
  console.log(interaction)
  const { channelId, guildId } = interaction;
  const channel = await interaction.client.channels.fetch(channelId);

  //const voice_channel_id = interaction.guild.members.cache.get(interaction.member.user.id).voice.channelId

  const memberId = interaction.member?.user.id || '';
  const voiceChannelId = interaction.guild?.members.cache.get(memberId)?.voice.channelId;

  await interaction.reply("Queueing or playing a song!");

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
