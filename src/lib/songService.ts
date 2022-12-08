import { Logger } from "tslog";
import Youtube from "youtube.ts";
import { exec as ytdlexec } from "youtube-dl-exec";
import { Readable } from "stream";

interface SearchResult {
  videoId: string;
  title: string;
  thumbnail: string;
}

const log: Logger = new Logger();

const YOUTUBE_URL = "https://www.youtube.com/watch?v=";
const youtubeRE =
  /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]+)(\S+)?$/;

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

  getReadableStream(videoId: string): Readable {
    const stream = ytdlexec(
      this.parseUrl(videoId),
      {
        output: "-",
        format: "bestaudio",
        limitRate: "1M",
        rmCacheDir: true,
        verbose: true,
      },
      { stdio: ["ignore", "pipe", "pipe"] }
    );

    stream.on("error", (err: any) => {
      stream.kill("SIGTERM");
      console.log("ERROR", "Spawn failed!", err);
    });

    stream.unref();

    return stream.stdout!;
  }

  parseUrl(url: string): string {
    return url.match(youtubeRE) ? url : `${YOUTUBE_URL}${url}`;
  }
}

export default SongService;
