import {
  AudioPlayer,
  AudioPlayerState,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionState,
  VoiceConnectionStatus,
} from "@discordjs/voice";
import { AttachmentBuilder, TextChannel } from "discord.js";
import { Logger } from "tslog";

import { i18n } from "../i18n.config";
import { songService } from "../lib/songService";
import { getHook, getSpeech } from "../lib/speech";
import { Song } from "../types/player";

const log: Logger = new Logger();

class Player {
  public readonly voiceConnection: VoiceConnection;
  public readonly textChannel: TextChannel;
  public readonly audioPlayer: AudioPlayer;
  public currentSong: Song | null | undefined;
  public queue: Song[];
  public hookPlaying: boolean

  constructor(voiceConnection: VoiceConnection, textChannel: TextChannel) {
    this.voiceConnection = voiceConnection;
    this.textChannel = textChannel;
    this.audioPlayer = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Play,
      },
    });
    this.currentSong;
    this.queue = [];
    this.hookPlaying = false;

    voiceConnection.subscribe(this.audioPlayer);

    this.voiceConnection.on(
      "stateChange",
      async (
        _: VoiceConnectionState,
        newState: VoiceConnectionState
      ) => {
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
      (_: AudioPlayerState, newState: AudioPlayerState) => {
        if (newState.status === AudioPlayerStatus.Idle) {
          if (this.hookPlaying) return this.playSong();
          return this.processQueue();
        }
      }
    );
  }

  public async play(song: Song) {
    this.queue.push(song);

    if (this.audioPlayer.state.status === AudioPlayerStatus.Idle) {
      this.processQueue();
      await this.playHook();
    }
  }

  public skip() {
    const skipped = this.currentSong;
    this.audioPlayer.state.status = AudioPlayerStatus.Idle;

    if (this.currentSong) this.processQueue();

    return skipped;
  }

  public async speech(text: string | undefined) {
    const speech = text ? await getSpeech(text) : "Something went wrong.";
    const speechResource = createAudioResource(speech);

    this.audioPlayer.play(speechResource);
  }

  public stop() {
    this.currentSong = null;
    this.queue = [];
    this.audioPlayer.stop(true);
  }

  public viewQueue() {
    return this.queue;
  }

  private processQueue() {
    if (this.queue.length === 0) {
      log.info("Queue is empty. Destroying the connection.");
      this.voiceConnection.destroy();

      return this.textChannel.send(i18n.__("commands.song.queueEmpty"));
    }

    this.currentSong = this.queue.shift()!;
    this.playHook();
  }

  private async playHook() {
    if (!this.currentSong) return;

    const hook = await getHook(this.currentSong);
    const hookResource = createAudioResource(hook);

    /* Since we can't just wait for audio to finish playing,
       this lock is required for playing consecutive audio (hook into song)
       It allows for a transition between states without just skipping to
       the next song */
    this.hookPlaying = true;
    this.audioPlayer.play(hookResource);
  }

  private async playSong() {
    if (!this.currentSong) return;

    const song = this.currentSong;
    const image = new AttachmentBuilder(song.thumbnail);
    const stream = await songService.getReadableStream(song.videoId);
    const resource = createAudioResource(stream);

    await this.textChannel.send({
      content: i18n.__mf("commands.song.playing", song.title),
      files: [image],
    });

    this.hookPlaying = false;
    this.audioPlayer.play(resource);

    this.audioPlayer.on("error", (e: any) => {
      log.error("Error:", e)
      log.error("Oh noes. Audio player error");
      log.error(`Error playing ${this.currentSong?.title}`);
    });

    log.info("Playing: ", this.currentSong?.title);
  }
}

export default Player;
