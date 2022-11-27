import { joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import { Logger } from "tslog";
import SongService from "../lib/songService";

import { SongParams } from "../types/player";

const log: Logger = new Logger();
const songService: SongService = new SongService();

class Player {
  constructor() {
    log.info("Instantiating Player class.");
  }

  async addSong(params: SongParams) {
    const { guild, guildId, voiceChannelId, query } = params;
    const song = this.searchSong(query);

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId,
      adapterCreator: guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      /* Placeholder */
      log.info(
        `The connection has entered the Ready state. ready to play ${song}`
      );
    });
  };

  async searchSong(query: string) {
    try {
      return songService.searchVideos(query);
    } catch (err) {
      log.error('Song search failed to return a response');
    }
  }
}

export default Player;
