import Youtube from "@bryanmytko/youtube.ts";
import { decode } from "html-entities";
import ytdl from "@distube/ytdl-core";

interface SearchResult {
  videoId: string;
  title: string;
  thumbnail: string;
}

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
  }

  getReadableStream(videoId: string) {
    return ytdl(videoId, {
      filter: "audioonly",
      quality: "lowestaudio",
    });
  }

  parseUrl(url: string): string {
    return url.match(youtubeRE) ? url : `${YOUTUBE_URL}${url}`;
  }
}

export const songService = new SongService();
