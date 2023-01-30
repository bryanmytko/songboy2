import { Client, CommandInteraction } from "discord.js";

export const mockClient = new Client({ intents: [] });
export const mockInteraction = Reflect.construct(CommandInteraction, [
  mockClient,
  {
    data: "foo",
    user: {
      username: "bob",
    },
  },
]);
