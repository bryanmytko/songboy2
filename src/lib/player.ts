import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnection,
  VoiceConnectionState,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { AttachmentBuilder, TextBasedChannel } from "discord.js";
import { Logger } from "tslog";

import { i18n } from "../i18n.config";
import SongService from "../lib/songService";
import { SongParams } from "../types/player";

const log: Logger = new Logger();

interface Song {
  videoId: string;
  title: string;
  thumbnail: string;
}

class Player {
  public readonly voiceConnection: VoiceConnection;
  public readonly textChannel: TextBasedChannel;
  public readonly audioPlayer: AudioPlayer;
  public readonly songService: SongService;
  public queue: Song[];

  constructor(voiceConnection: VoiceConnection, textChannel: TextBasedChannel) {
    this.voiceConnection = voiceConnection;
    this.textChannel = textChannel;
    this.audioPlayer = createAudioPlayer();
    this.songService = new SongService();
    this.queue = [];

    voiceConnection.subscribe(this.audioPlayer);

    this.voiceConnection.on(
      "stateChange",
      async (_: VoiceConnectionState, newState: VoiceConnectionState) => {
        if (newState.status === "disconnected") {
          try {
            await Promise.race([
              entersState(
                this.voiceConnection,
                VoiceConnectionStatus.Signalling,
                5_000
              ),
              entersState(
                this.voiceConnection,
                VoiceConnectionStatus.Connecting,
                5_000
              ),
            ]);
          } catch (error) {
            voiceConnection.destroy();
          }
        }
      }
    );

    this.audioPlayer.on(
      "stateChange",
      (oldState: AudioPlayerState, newState: AudioPlayerState) => {
        if (
          newState.status === AudioPlayerStatus.Idle &&
          oldState.status !== AudioPlayerStatus.Idle
        ) {
          void this.processQueue();
        }
      }
    );

    this.audioPlayer.on("error", () => {
      log.error("Oh noes. Audio player error");
    });
  }

  async addSong(params: SongParams): Promise<Song> {
    /* This will also eventually handle:
        - DJ hook
        - DB logging
        - Reconnect logic
    */

    const { query } = params;

    try {
      return this.songService.searchVideos(query);
    } catch {
      throw new Error("Something went wrong. Could not add song.");
    }
  }

  public addToQueue(song: Song) {
    this.queue.push(song);
    this.processQueue();
  }

  public stop() {
    this.queue = [];
    this.audioPlayer.stop(true);
  }

  public viewQueue() {
    return this.queue;
  }

  private async processQueue() {
    if (this.queue.length === 0)
      return this.textChannel.send(i18n.__("commands.song.queueEmpty"));

    if (this.audioPlayer.state.status !== AudioPlayerStatus.Idle) return;

    const nextSong = this.queue.shift()!;
    const stream = await this.songService.getReadableStream(nextSong.videoId);
    const resource = createAudioResource(stream);

    try {
      const file = new AttachmentBuilder(nextSong.thumbnail);

      await this.textChannel.send({
        content: i18n.__mf("commands.song.playing", nextSong.title),
        files: [file],
      });
      this.audioPlayer.play(resource);
    } catch (error) {
      this.processQueue();
    }
  }
}

export default Player;
