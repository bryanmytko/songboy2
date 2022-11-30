import internal from "stream";
import { Logger } from "tslog";
import Youtube from "youtube.ts";

interface SongType {
  videoId: string;
  title: string;
  thumbnail: string;
}

const log: Logger = new Logger();

class SongService {
  public readonly youtube: Youtube;
  constructor() {
    const { GOOGLE_API_KEY } = process.env;
    this.youtube = new Youtube(GOOGLE_API_KEY);
  }

  async searchVideos(query: string): Promise<SongType> {
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
        title: snippet.title.replace(/&quot;/g, '"') || "",
        thumbnail: snippet.thumbnails.high.url || "",
      };
    } catch (e: any) {
      log.error(e.message);
      throw new Error();
    }
  }

  async getReadableStream(videoId: string): Promise<internal.Readable> {
    return this.youtube.util.streamMP3(videoId);
  }
}

export default SongService;
