import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import internal from "stream";
import { Logger } from "tslog";

import SongService from "../lib/songService";
import { SongParams } from "../types/player";

const log: Logger = new Logger();
const songService: SongService = new SongService();
const audioPlayer = createAudioPlayer();

interface SongType {
  song: internal.Readable
  title: string
  thumbnail: string
}

class Player {
  constructor() {
    log.info("Instantiating Player class.");
  }

  async addSong(params: SongParams): Promise<SongType> {
    const { guild, guildId, voiceChannelId, query } = params;
    const song = await this.searchSong(query);

    if (!song) throw new Error('Somethign went wrong.');

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId,
      adapterCreator: guild.voiceAdapterCreator,
    });

    const resource = createAudioResource(song.song);
    audioPlayer.play(resource);
    connection.subscribe(audioPlayer);

    connection.on(VoiceConnectionStatus.Ready, (connection) => {
      /* Placeholder */
      log.info(
        `The connection has entered the Ready state. ready to play ${song}`
      );
    });

    return song;
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
