import { clear, connect, disconnect } from "../db";
import { CommandInteraction, TextChannel } from "discord.js";
import { VoiceConnection } from "@discordjs/voice";

import { Song } from "../../src/models/song";
import Player from "../../src/lib/player";

const command = require("../../src/commands/random");

const mockPlay = jest.fn();
jest.mock("../../src/lib/player", () => {
  return jest.fn().mockImplementation(() => {
    return {
      play: mockPlay,
    };
  });
});

const mockRandom = jest.fn().mockImplementationOnce(() => Promise.resolve(3));
jest.mock("../../src/models/song", () => ({
  Song: jest.requireActual("../../src/models/song").Song,
  random: () => mockRandom,
}));

const mockPlayer = Player as jest.MockedClass<typeof Player>;
const interactionSpy = jest.spyOn(CommandInteraction.prototype, "reply");

beforeAll(async () => connect());

afterEach(async () => clear());

afterAll(async () => disconnect());

describe("Random command", () => {
  let player: Player;
  const mockVoiceConnection = {} as VoiceConnection;
  const mockTestChannel = {} as TextChannel;

  beforeEach(() => {
    player = new mockPlayer(mockVoiceConnection, mockTestChannel);
  });

  it("plays a random song", async () => {
    const songRecord = {
      title: "Faith of the Heart",
      url: "B0azMOJ-h_o",
      requester: "Bryan",
      thumbnail: "enterprise.jpg",
      date: new Date(),
    };

    await Song.create(songRecord);
    await command.execute(interactionSpy, "", player);

    expect(Player).toHaveBeenCalled();
  });

  describe("when there are no songs", () => {
    it("explodes", () => {});
  });
});
