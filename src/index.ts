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
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});
client.commands = new Collection<string, Command>();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file: any) => file.endsWith(".js"));

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

  let player = players.get(guildId);

  if (!player) {
    if (
      interaction.member instanceof GuildMember &&
      interaction.member.voice.channel
    ) {
      const { channel } = interaction.member.voice;

      player = new Player(
        joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        }),
        textChannel
      );

      player.voiceConnection.on("error", console.warn);
      players.set(guildId, player);
    }
  }

  if (!player) {
    interaction.reply(i18n.__("commands.song.noVoiceChannel"));
    return;
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
