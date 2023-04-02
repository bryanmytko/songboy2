# Songboy2

SongBoy is a Discord bot that mostly acts as a DJ, taking song requests and playing them over voice channels. Music is provided by [YouTube](https://developers.google.com/youtube/v3).
It utilizes [Google Text-to-Speech](https://cloud.google.com/text-to-speech) and [ChatGPT](https://platform.openai.com/docs/api-reference) to provide more personal interactions, such as flavorful DJ hooks and a chat functionality.

It stores all requested songs in a database which powers the random command and can be useful for future shenanigans.

![songboy](songboy.png)

### Commands

**/song** query: string

Plays a song or add it to the queue. You must be in a public voice channel to use this command.

**/queue**

See the current songs in queue.

**/top** query: number

Shows the `n` top most requested songs

**/skip**

Skips the current song

**/random**

Get a random song from the pool of all songs that have been played in the past. Songs requested more often are weighted to be chosen more frequently.

**/stop**

Stop the bot. He should resume on any subsequent commands. Useful for recovering from error states without requiring a reboot.

**EXPERIMENTAL BETA COMMANDS**

**/chat** query: string

Ask SongBoy to converse with you. This is currently powered by ChatGPT.

### Setup

1. Clone repo & create a bot via the [Discord Developer Portal](https://discord.com/developers/applications)
2. Set discord environment variables

```
DISCORD_BOT_TOKEN=xxx
CLIENT_ID=xxx
GUILD_ID=xxx
```

3. Set up keys for Google API (YouTube) and \*.json credentials (TTS)

```
GOOGLE_API_KEY=xxxx
GOOGLE_APPLICATION_CREDENTIALS=foo.json
```

4. Install mongodb and create a database for any environments you need & testing

```
MONGO_URL=
MONGO_TEST_URL=
```

5. If you want to use the experimental chat feature, add openai API key and set enabled flag to true

```
OPENAI_API_KEY=xxxxxxxxxxxxxxxxxxxxxx
CHAT_ENABLED=true
```

6. Invite bot to server

[https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=0&scope=bot%20applications.commands](https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=0&scope=bot%20applications.commands)

7. Deploy commands to Discord. You can run this remotely or locally as long as the discord tokens are set.

```console
$ npm run deploy-commands
```

8. Start the bot

> Production

```console
$ npm start
```

> Development

```console
$ npm run start:dev
```
