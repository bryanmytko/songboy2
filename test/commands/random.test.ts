import { clear, connect, disconnect } from "../db";
import { CommandInteraction, TextChannel } from "discord.js";
import { VoiceConnection } from "@discordjs/voice";

import { Song } from "../../src/models/song";
import Player from "../../src/lib/player";
import { mockInteraction } from "../mocks/discord";

const command = require("../../src/commands/random");

const mockPlay = jest.fn();
jest.mock("../../src/lib/player", () => {
  return jest.fn().mockImplementation(() => {
    return {
      play: mockPlay,
    };
  });
});

describe("Random command", () => {
  const mockPlayer = Player as jest.MockedClass<typeof Player>;
  const mockVoiceConnection = {} as VoiceConnection;
  const mockTestChannel = {} as TextChannel;

  mockInteraction.reply = jest.fn();
  const interactionSpy = jest.spyOn(mockInteraction, "reply");

  let player: Player;

  afterAll(async () => disconnect());
  afterEach(async () => {
    jest.clearAllMocks();
    await clear();
  });

  beforeAll(async () => connect());
  beforeEach(() => {
    player = new mockPlayer(mockVoiceConnection, mockTestChannel);
  });

  it("plays a random song", async () => {
    const mockRandom = jest
      .fn()
      .mockImplementationOnce(() => Promise.resolve());

    jest.mock("../../src/models/song", () => ({
      Song: jest.requireActual("../../src/models/song").Song,
      random: () => mockRandom,
    }));

    const songRecord = {
      title: "Faith of the Heart",
      url: "B0azMOJ-h_o",
      requester: "Bryan",
      thumbnail: "enterprise.jpg",
      date: new Date(),
    };

    await Song.create(songRecord);
    await command.execute(mockInteraction, "", player);

    expect(player.play).toHaveBeenCalled();
  });

  describe("when there are no songs", () => {
    it("it does not call the player", async () => {
      await command.execute(mockInteraction, "", player);

      expect(player.play).not.toHaveBeenCalled();
      expect(interactionSpy).toHaveBeenCalled();
    });
  });
});
