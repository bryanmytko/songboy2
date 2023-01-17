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
import { songService } from "../lib/songService";
import { getHook } from "../lib/hooks";
import { Song } from "../types/player";

const log: Logger = new Logger();

class Player {
  public readonly voiceConnection: VoiceConnection;
  public readonly textChannel: TextBasedChannel;
  public readonly audioPlayer: AudioPlayer;
  public currentSong: Song | null | undefined;
  public queue: Song[];
  public inProcess: boolean;

  constructor(voiceConnection: VoiceConnection, textChannel: TextBasedChannel) {
    this.voiceConnection = voiceConnection;
    this.textChannel = textChannel;
    this.audioPlayer = createAudioPlayer();
    this.currentSong;
    this.queue = [];
    this.inProcess = false;

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
          } catch (e: any) {
            log.error("VoiceConnection error", e?.message);
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
          oldState.status !== AudioPlayerStatus.Idle &&
          !this.inProcess
        )
          return this.processQueue();

        if (
          newState.status === AudioPlayerStatus.Idle &&
          oldState.status !== AudioPlayerStatus.Idle
        )
          return this.playNextSong();
      }
    );
  }

  public async play(song: Song) {
    this.queue.push(song);
    this.processQueue();
  }

  public skip() {
    const skipped = this.currentSong;
    this.audioPlayer.state.status = AudioPlayerStatus.Idle;

    if (this.currentSong) this.processQueue();

    return skipped;
  }

  public stop() {
    this.currentSong = null;
    this.queue = [];
    this.audioPlayer.stop(true);
  }

  public viewQueue() {
    return this.queue;
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      log.info("Queue is empty. Destroying the connection.");
      this.voiceConnection.destroy();
      return this.textChannel.send(i18n.__("commands.song.queueEmpty"));
    }

    this.currentSong = this.queue.shift()!;
    if (!this.currentSong) return;

    const hook = await getHook(this.currentSong);
    const hookResource = createAudioResource(hook);

    this.inProcess = true;
    this.audioPlayer.play(hookResource);

    this.audioPlayer.on("error", (_: any) => {
      log.error("Oh noes. Audio player error");
      log.error(`Error playing ${this.currentSong?.title}`);
    });

    log.info("Playing: ", this.currentSong?.title);
  }

  private async playNextSong() {
    if (!this.currentSong) return;

    const song = this.currentSong;
    const image = new AttachmentBuilder(song.thumbnail);
    const stream = await songService.getReadableStream(song.videoId);
    const resource = createAudioResource(stream);

    await this.textChannel.send({
      content: i18n.__mf("commands.song.playing", song.title),
      files: [image],
    });

    this.inProcess = false;
    this.audioPlayer.play(resource);
  }
}

export default Player;
