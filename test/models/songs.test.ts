import { clear, connect, disconnect } from "../db";
import { Song, topTen } from "../../src/models/song";

describe("Song", () => {
  beforeAll(async () => connect());

  afterEach(async () => clear());

  afterAll(async () => disconnect());

  describe("Song", () => {
    it("creates a song", async () => {
      const songRecord = {
        title: "foo",
        url: "12345",
        requester: "me",
        thumbnail: "foo.jpg",
        date: new Date()
      };

      const { id } = await Song.create(songRecord);
      const song = await Song.findById(id);

      if (song) {
        expect(song.title).toEqual(songRecord.title);
        expect(song.url).toEqual(songRecord.url);
        expect(song.requester).toEqual(songRecord.requester);
        expect(song.thumbnail).toEqual(songRecord.thumbnail);
      }
    });

    describe(".topTen", () => {
      it("returns the top 10 most requested songs in order", async () => {
        const songRecord = {
          url: "12345",
          requester: "me",
          thumbnail: "img.jpg",
          date: new Date()
        }

        for (let i = 0; i < 10; i++) {
          await Song.create({ ...songRecord, title: "foo1" });
        }
        for (let i = 0; i < 9; i++) {
          await Song.create({ ...songRecord, title: "foo4" });
        }
        for (let i = 0; i < 8; i++) {
          await Song.create({ ...songRecord, title: "foo3" });
        }
        for (let i = 0; i < 7; i++) {
          await Song.create({ ...songRecord, title: "foo2" });
        }
        for (let i = 0; i < 6; i++) {
          await Song.create({ ...songRecord, title: "foo5" });
        }
        for (let i = 0; i < 5; i++) {
          await Song.create({ ...songRecord, title: "foo6" });
        }
        for (let i = 0; i < 4; i++) {
          await Song.create({ ...songRecord, title: "foo7" });
        }
        for (let i = 0; i < 3; i++) {
          await Song.create({ ...songRecord, title: "foo8" });
        }
        for (let i = 0; i < 2; i++) {
          await Song.create({ ...songRecord, title: "foo9" });
        }
        await Song.create({ ...songRecord, title: "foo10" });

        const top = await topTen();

        expect(top[0].title).toEqual("foo1");
        expect(top[1].title).toEqual("foo4");
        expect(top[2].title).toEqual("foo3");
        expect(top[3].title).toEqual("foo2");
        expect(top[9].title).toEqual("foo10");
        expect(top[10]).toBeNull;
      });
    });
  });
});
