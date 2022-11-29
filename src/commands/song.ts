import { AttachmentBuilder, ChatInputCommandInteraction, GuildMember, SlashCommandBuilder, Snowflake, VoiceChannel } from "discord.js";
import { Logger } from "tslog";

import Player from "../lib/player";
import { i18n } from "../i18n.config";
import { Source } from "../types/player";
import { joinVoiceChannel } from "@discordjs/voice";
import { channel } from "diagnostics_channel";

const log: Logger = new Logger();
//const player: Player = new Player();
const players = new Map<Snowflake, Player>();

const execute = async (
  interaction: ChatInputCommandInteraction,
  query: string
) => {
  const { guildId } = interaction;
  const memberId = interaction.member?.user.id || "";

  if (!guildId) return log.error("No guildID found!");

  let player = players.get(guildId);

  if (!player) {
    if (interaction.member instanceof GuildMember
      && interaction.member.voice.channel) {
      const { channel } = interaction.member.voice;

      player = new Player(joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      }));

      player.voiceConnection.on("error", console.warn);
      players.set(guildId, player);
    }
  }

  if (!player) return interaction
    .followUp(i18n.__("commands.song.noVoiceChannel"));

  const song = await player.addSong({
    message: "", // This will be DJ hook. Might just move this inside Player
    query,
    source: Source.Request,
  });

  player.addToQueue(song);

  //await interaction.reply(`Adding ${song.title} to the playlist`);
  // const file = new AttachmentBuilder(song.thumbnail);
  // await interaction.reply({ content: "hi", files: [file] });
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName(i18n.__("commands.song.name"))
    .setDescription(i18n.__("commands.song.desc"))
    .addStringOption(option =>
      option
        .setName(i18n.__("commands.song.search.name"))
        .setDescription(i18n.__("commands.song.search.desc"))
        .setRequired(true)),
  execute,
};
