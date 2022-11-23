import { joinVoiceChannel } from '@discordjs/voice';
import { channel } from 'diagnostics_channel';
import { Channel, Guild, Interaction } from 'discord.js';

interface SongParams {
  input: string,
  message: string,
  source: string, // enum?
  voiceChannelId: string | null | undefined,
  // guildId: string | null,
  interaction: any,
  // state: string
}

class Player {
  constructor() {
    //this.voiceChannel;
  }

  async addSong(params: SongParams) {
    const { interaction, voiceChannelId } = params;
    if (!interaction.guildId || !interaction.guild) return console.log('Error. Must join a voice channel!');
    if (!voiceChannelId) return console.log("ERRRRRROR")


    console.log('Joining boice channel', voiceChannelId)

    const connection = await joinVoiceChannel({
      channelId: voiceChannelId, //"970288330900111360",
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    const { VoiceConnectionStatus } = require('@discordjs/voice');

    connection.on(VoiceConnectionStatus.Ready, () => {
      console.log('The connection has entered the Ready state - ready to play audio!');
    });
  }
};

export default Player;