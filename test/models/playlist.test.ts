import { clear, connect, disconnect } from "../db";
import { Playlist } from "../../src/models/playlist";

describe("Playlist", () => {
  beforeAll(async () => connect());

  afterEach(async () => clear());

  afterAll(async () => disconnect());

  describe("Playlist", () => {
    it("creates a playlist", async () => {
      const playlistRecord = {
        title: "Best Playlist Ever",
        songs: [
          {
            requester: "me",
            url: "12345",
            title: "foo",
            img: "avatar.jpg",
            source: "reconnect",
          },
        ],
        message: {
          channel: "1",
          guild: {
            id: 1234,
          },
          member: {
            voice: {
              channel: "911",
            },
          },
        },
      };

      const { id } = await Playlist.create(playlistRecord);
      const playlist = await Playlist.findById(id);

      if (playlist) {
        expect(playlist.title).toEqual(playlistRecord.title);
        expect(playlist.songs[0].title).toEqual(playlistRecord.songs[0].title);
        expect(playlist.message?.channel).toEqual(
          playlistRecord.message.channel
        );
      }
    });
  });
});
