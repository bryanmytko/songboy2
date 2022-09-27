import { Client, GatewayIntentBits } from 'discord.js';
import { i18n } from './i18n.config';

require('dotenv').config();

const { DISCORD_BOT_TOKEN } = process.env;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', ():void => {
  console.log(i18n.__('status.connected'));
});

client.login(DISCORD_BOT_TOKEN);
client.on('disconnected', ():void => console.log(i18n.__('status.disconnected')));
