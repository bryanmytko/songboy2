import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  GuildMember,
  Snowflake,
} from "discord.js";
import { joinVoiceChannel, VoiceConnectionStatus } from "@discordjs/voice";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import { Logger } from "tslog";

import { Command } from "./types";
import { i18n } from "./i18n.config";
import Player from "./lib/player";

require("dotenv").config();
const { DISCORD_BOT_TOKEN, MONGO_URL } = process.env;

mongoose.connect(MONGO_URL || "");
const db = mongoose.connection;
db.once("open", () => log.info("Database connected."));

const log: Logger = new Logger();
const players = new Map<Snowflake, Player>();

const client = new Client({
  intents: [
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds,
  ],
});

client.commands = new Collection<string, Command>();

const commandsPath = path.join(__dirname, "commands");
let commandFiles;

if (process.env.NODE_ENV === "production") {
  commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: any) => file.endsWith(".js"));
} else {
  commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file: any) => file.endsWith(".ts"));
}

client.on("unhandledRejection", (e: any) => {
  log.error("Unhandled promise rejection:", e);
});

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    log.warn(i18n.__mf("command.missingProperty", filePath));
  }
}

client.once(Events.ClientReady, (c) => {
  log.info(i18n.__mf("status.connected", c.user.username));
});

client.login(DISCORD_BOT_TOKEN);

client.on(Events.InteractionCreate, async (interaction) => {
  const { channel: textChannel, guildId } = interaction;

  if (!guildId || !textChannel || !interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  const query = interaction.options.getString("search");
  let voiceConnection;

  let player = players.get(guildId);

  if (!player) {
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel
    ) {
      const { channel } = interaction.member.voice;

      voiceConnection = joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
      })

      player = new Player(voiceConnection, textChannel);

      player.voiceConnection.on("error", console.warn);
      players.set(guildId, player);
    }

    if (!player) {
      interaction.reply(i18n.__("commands.song.noVoiceChannel"));
      return;
    }
  }

  // ref: https://stackoverflow.com/questions/71344815/how-would-i-detect-when-a-user-is-speaking-in-a-voice-channel-discord-js-v13
  /* TODO
  1. Speech -> Text API (mozilla? google?)
  2. Convert result to command
  3. How to listen to everyone (currently only listens to someone who uses a command)??
  */
  if (voiceConnection && interaction.member instanceof GuildMember) {
    const r = voiceConnection.receiver;
    r.subscribe(interaction.member.id);
    r.speaking.on('start', userId => {
      console.log("I hear you ", userId)
    });
  }

  try {
    await command.execute(interaction, query, player);
  } catch (error) {
    await interaction.reply({
      content: i18n.__("command.error"),
      ephemeral: true,
    });
  }
});

client.on(VoiceConnectionStatus.Disconnected, (): void => {
  log.error(i18n.__("status.disconnected"));
});
