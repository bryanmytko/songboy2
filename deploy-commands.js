/* Slightly modified version of the script provided by:
https://discordjs.guide/creating-your-bot/command-deployment.html */

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
require("dotenv").config();

const { CLIENT_ID, GUILD_ID, DISCORD_BOT_TOKEN } = process.env;

const commands = [];
const commandFiles = fs.readdirSync('./dist/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./dist/commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN);

(async () => {
  try {
    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    const data = await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (error) {
    console.error(error);
  }
})();