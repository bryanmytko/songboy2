import { joinVoiceChannel } from '@discordjs/voice';
const { VoiceConnectionStatus } = require('@discordjs/voice');
import { Logger } from "tslog";

const log: Logger = new Logger();

interface SongParams {
  input: string,
  message: string,
  source: string, // enum?
  voiceChannelId: string | null | undefined,
  interaction: any,
};

class Player {
  constructor() {
    log.info('Instantiating Player class.');
  }

  async addSong(params: SongParams) {
    const { interaction, voiceChannelId } = params;

    if (!interaction.guildId || !interaction.guild) {
      /* Remove this when interaction type becomes enforceable */
      return log.error('Error. Missing guild.');
    }

    if (!voiceChannelId) {
      /* This needs to bubble up to the user
         or be handled in the calling command. */
      return log.error("Error. Must be in a voice channel.");
    }

    const connection = await joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: interaction.guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      /* Placeholder */
      log.info('The connection has entered the Ready state. ready to play audio!');
    });
  }
};

export default Player;