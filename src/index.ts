import { Client, GatewayIntentBits } from "discord.js";
import { Logger } from "tslog";

import { i18n } from "./i18n.config";

require("dotenv").config();

const log: Logger = new Logger();
const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once("ready", (): void => {
  log.info(i18n.__("status.connected"));
});

client.login(DISCORD_BOT_TOKEN);

client.on("disconnected", (): void => {
  log.info(i18n.__("status.disconnected"));
});
