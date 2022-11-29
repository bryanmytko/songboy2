import { AudioPlayer, createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import { Snowflake } from "discord.js";
import internal from "stream";
import { Logger } from "tslog";

import SongService from "../lib/songService";
import { SongParams } from "../types/player";

const log: Logger = new Logger();
const songService: SongService = new SongService();
const audioPlayer = createAudioPlayer();

interface Song {
  stream: internal.Readable
  title: string
  thumbnail: string
}

class Player {
  public readonly voiceConnection: VoiceConnection;
  public readonly audioPlayer: AudioPlayer;
  public queue: Song[];

  constructor(voiceConnection: VoiceConnection) {
    this.voiceConnection = voiceConnection;
    this.audioPlayer = createAudioPlayer();
    this.queue = [];

    // this.audioPlayer.on("stateChange", (oldState: { status: any; resource: any; }, newState: { status: any; resource: any; }) => {
    //   if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
    //     // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
    //     // The queue is then processed to start playing the next track, if one is available.
    //     (oldState.resource as AudioResource<Track>).metadata.onFinish();
    //     void this.processQueue();
    //   } else if (newState.status === AudioPlayerStatus.Playing) {
    //     // If the Playing state has been entered, then a new track has started playback.
    //     (newState.resource as AudioResource<Track>).metadata.onStart();
    //   }
    // });

    // this.audioPlayer.on('error', (error: { resource: any; }) => (error.resource as AudioResource<Track>).metadata.onError(error));

    voiceConnection.subscribe(this.audioPlayer);
  }

  async addSong(params: SongParams): Promise<Song> {
    const { query } = params;
    const song = await this.searchSong(query);

    if (!song) throw new Error('Something went wrong. Could not add song.');

    // const resource = createAudioResource(song.song);

    // connection.on(VoiceConnectionStatus.Ready, () => {
    //   audioPlayer.play(resource);
    //   connection.subscribe(audioPlayer);
    // });


    return song;
  };

  public addToQueue(song: Song) {
    this.queue.push(song);
    void this.processQueue();
  }

  public stop() {
    this.queue = [];
    this.audioPlayer.stop(true);
  }

  private processQueue() {
    if (this.queue.length === 0) {
      log.info('Queue is empty!');
    }

    const nextSong = this.queue.shift()!;
    const resource = createAudioResource(nextSong.stream);

    try {
      this.audioPlayer.play(resource);
    } catch (error) {
      this.processQueue();
    }
  }

  private async searchSong(query: string) {
    try {
      return songService.searchVideos(query);
    } catch (err) {
      log.error('Song search failed to return a response');
    }
  }
}

export default Player;
