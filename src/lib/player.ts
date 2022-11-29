import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  VoiceConnection,
} from "@discordjs/voice";
import { AttachmentBuilder, ChatInputCommandInteraction } from "discord.js";
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
  public readonly interaction: ChatInputCommandInteraction;
  public readonly audioPlayer: AudioPlayer;
  public readonly songService: SongService;
  public queue: Song[];

  constructor(
    voiceConnection: VoiceConnection,
    interaction: ChatInputCommandInteraction
  ) {
    this.voiceConnection = voiceConnection;
    this.interaction = interaction;
    this.audioPlayer = createAudioPlayer();
    this.songService = new SongService();
    this.queue = [];

    voiceConnection.subscribe(this.audioPlayer);
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
    void this.processQueue();
  }

  public stop() {
    this.queue = [];
    this.audioPlayer.stop(true);
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      return this.interaction.reply(i18n.__("commands.song.queueEmpty"));
    }

    const nextSong = this.queue.shift()!;
    const stream = await this.songService.getReadableStream(nextSong.videoId);
    const resource = createAudioResource(stream);

    try {
      const file = new AttachmentBuilder(nextSong.thumbnail);

      await this.interaction.reply({
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
