import { clear, connect, disconnect } from "../db";
import { ChatInputCommandInteraction } from "discord.js";

import { Song } from "../../src/models/song";
import Player from "../../src/lib/player";

const command = require("../../src/commands/random");

const mockPlay = jest.fn();
jest.mock("../../src/lib/player", () => {
  return jest.fn().mockImplementation(() => {
    return { play: mockPlay };
  });
});

const interactionSpy = jest.spyOn(
  ChatInputCommandInteraction.prototype,
  "reply"
);

beforeAll(async () => connect());

afterEach(async () => clear());

afterAll(async () => disconnect());

describe("Random command", () => {
  let player: jest.Mock<Player>;

  beforeEach(() => {
    player = new (Player as any)();
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
    command.execute(interactionSpy, "", player);

    expect(Player).toHaveBeenCalled();
    expect(interactionSpy).toHaveBeenCalled();
  });

  describe("when there are no songs", () => {
    it("explodes", () => {});
  });
});
