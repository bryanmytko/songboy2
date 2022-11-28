import { Logger } from "tslog";
import Youtube from "youtube.ts";

const log: Logger = new Logger();

const { GOOGLE_API_KEY } = process.env;

interface SongService {
  youtube: Youtube
}

interface SongType {
  title: string,
  thumbnail: string
}

class SongService {
  constructor() {
    try {
      this.youtube = new Youtube(GOOGLE_API_KEY);
    } catch (e) {
      log.error('Invalid or missing YouTube API key!')
    }
  }

  async searchVideos(query: string): Promise<SongType> {
    const videoSearch = await this
      .youtube.videos.search({ q: query, maxResults: 1 });

    const result = videoSearch.items[0];
    const { snippet } = result;
    const { videoId } = result.id;

    const readableStream = await this
      .youtube.util.streamMP3(videoId);

    return {
      title: snippet.title || "",
      thumbnail: snippet.thumbnails.high.url || ""
    }
  }
}

export default SongService;