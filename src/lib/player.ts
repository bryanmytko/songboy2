import { joinVoiceChannel } from "@discordjs/voice";
import { VoiceConnectionStatus } from "@discordjs/voice";
import { Guild } from "discord.js";
import { Logger } from "tslog";

const log: Logger = new Logger();

enum Source {
  Random,
  Reconnect,
  Request,
}

interface SongParams {
  guild: Guild;
  guildId: string;
  input: string;
  message: string;
  source: Source;
  voiceChannelId: string;
}

class Player {
  constructor() {
    log.info("Instantiating Player class.");
  }

  async addSong(params: SongParams) {
    const { guild, guildId, voiceChannelId } = params;

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId,
      adapterCreator: guild.voiceAdapterCreator,
    });

    connection.on(VoiceConnectionStatus.Ready, () => {
      /* Placeholder */
      log.info(
        "The connection has entered the Ready state. ready to play audio!"
      );
    });
  }
}

export default Player;
