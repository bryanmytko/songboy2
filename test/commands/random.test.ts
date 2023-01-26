import { clear, connect, disconnect } from "../db";
import { Song } from "../../src/models/song";

const command = require("../../src/commands/random");

beforeAll(async () => connect());

afterEach(async () => clear());

afterAll(async () => disconnect());

import Player from "../../src/lib/player";

const playerSpy = jest.spyOn(Player.prototype, "play");

describe("Random command", () => {
  it("plays a random song", async () => {
    const songRecord = {
      title: "Faith of the Heart",
      url: "B0azMOJ-h_o",
      requester: "Bryan",
      thumbnail: "enterprise.jpg",
      date: new Date(),
    };

    await Song.create(songRecord);
    command.execute("", playerSpy);
    expect(playerSpy).toHaveBeenCalled();
  });

  describe("when there are no songs", () => {
    it("explodes", () => {});
  });
});
