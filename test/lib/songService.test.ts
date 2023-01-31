import { songService } from "../../src/lib/songService";

const items = {
  items: [
    {
      id: {
        videoId: "1337",
      },
      snippet: {
        title: "Billy Joel - The Downeaster &#39;Alexa&#39; (Official Video)",
        thumbnails: {
          high: {
            url: "https://imgur.com/HVjKOGP",
          },
        },
      },
    },
  ],
};

jest.mock("@bryanmytko/youtube.ts", () => {
  return jest.fn().mockImplementation(() => {
    return {
      videos: {
        search: jest.fn(() => {
          return Promise.resolve(items);
        }),
      },
    };
  });
});

jest.mock("../../src/lib/player", () => {
  return jest.fn().mockImplementation(() => {
    return {
      play: jest.fn(),
    };
  });
});

describe("song service", () => {
  describe("search videos", () => {
    it("returns a video", async () => {
      const result = await songService.searchVideos("foobar fighters - best");

      expect(result.videoId).toEqual("1337");
    });

    it("formats the title properly", async () => {
      const result = await songService.searchVideos("foobar fighters - best");

      expect(result.title).toEqual(
        "Billy Joel - The Downeaster 'Alexa' (Official Video)"
      );
    });
  });
});
