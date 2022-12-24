# Songboy2

![songboy](songboy.png)

### Setup

1. Clone repo & create a bot via the [Discord Developer Portal](https://discord.com/developers/applications)
2. Set discord environment variables

  ```
  DISCORD_BOT_TOKEN=xxx
  CLIENT_ID=xxx
  GUILD_ID=xxx
  ```

3. Set up keys for Google API (YouTube) and *.json credentials (TTS)

  ```
  GOOGLE_API_KEY=xxxx
  GOOGLE_APPLICATION_CREDENTIALS=foo.json
  ```

4. Install mongodb and create a database for any environments you need & testing

  ```
  MONGO_URL=
  MONGO_TEST_URL=
  ```

5. Invite bot to server

[https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=0&scope=bot%20applications.commands](https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=0&scope=bot%20applications.commands)

6. Deploy commands to Discord

  ```console
  $ npm run deploy-commands
  ```

7. Start the bot

 > Production
 ```console
 $ npm start
 ```
 
 > Development
  ```console
  $ npm run start:dev
  ```



