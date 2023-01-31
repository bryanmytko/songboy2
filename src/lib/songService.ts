import { Logger } from "tslog";
import Youtube from "@bryanmytko/youtube.ts";
import { Readable } from "stream";
import { decode } from "html-entities";

interface SearchResult {
  videoId: string;
  title: string;
  thumbnail: string;
}

const log: Logger = new Logger();
require("dotenv").config();

const { GOOGLE_API_KEY } = process.env;
const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
const youtubeRE =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

class SongService {
  public readonly youtube: Youtube;
  constructor() {
    this.youtube = new Youtube(GOOGLE_API_KEY);
  }

  async searchVideos(query: string): Promise<SearchResult> {
    try {
      const videoSearch = await this.youtube.videos.search({
        q: query,
        maxResults: 1,
      });

      const result = videoSearch.items[0];
      const { snippet } = result;
      const { videoId } = result.id;

      return {
        videoId,
        title: decode(snippet.title) || "",
        thumbnail: snippet.thumbnails.high.url || "",
      };
    } catch (e: any) {
      log.error(e);
      throw new Error(e);
    }
  }

  getReadableStream(videoId: string): Promise<Readable> {
    return this.youtube.util.streamMP3(videoId);
  }

  parseUrl(url: string): string {
    return url.match(youtubeRE) ? url : `${YOUTUBE_URL}${url}`;
  }
}

export const songService = new SongService();
