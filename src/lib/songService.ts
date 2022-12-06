import internal from "stream";
import { Logger } from "tslog";
import Youtube from "youtube.ts";
import { exec as ytdlexec } from "youtube-dl-exec";

interface SearchResult {
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
        title: snippet.title.replace(/&quot;/g, '"') || "",
        thumbnail: snippet.thumbnails.high.url || "",
      };
    } catch (e: any) {
      log.error(e.status);
      throw new Error("API error. Check rate limit.");
    }
  }

  getReadableStream(videoId: string): internal.Readable {
    // return this.youtube.util.streamMP3(videoId);
    const stream = ytdlexec(
      `https://www.youtube.com/watch?v=${videoId}`,
      {
        output: "-",
        format:
          "bestaudio[ext=webm+acodec=opus+tbr>100]/bestaudio[ext=webm+acodec=opus]/bestaudio/best",
        limitRate: "1M",
        rmCacheDir: true,
        verbose: true,
      },
      { stdio: ["ignore", "pipe", "ignore"] }
    );
    console.log(stream)

    return stream.stdout!;
  }
}

export default SongService;
