import { Client, Collection, Events, GatewayIntentBits } from "discord.js";
import path from "path";
import fs from "fs";
import { Logger } from "tslog";

import { Command } from "./types";
import { i18n } from "./i18n.config";

require("dotenv").config();
const { DISCORD_BOT_TOKEN } = process.env;

const log: Logger = new Logger();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates
  ]
});

client.commands = new Collection<string, Command>();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file: any) => file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    log.warn(i18n.__mf("command.missingProperty", filePath));
  }
}

client.once(Events.ClientReady, c => {
  log.info(i18n.__mf("status.connected", c.user.username));
});

client.login(DISCORD_BOT_TOKEN);

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    log.error(i18n.__mf("command.missing", interaction.commandName));
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    log.error(error);
    await interaction
      .reply({ content: i18n.__("command.error"), ephemeral: true });
  }
});

/* TODO does this even exist anymore */
client.on("disconnected", (): void => {
  log.info(i18n.__("status.disconnected"));
});
