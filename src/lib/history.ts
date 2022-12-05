import { Song as SongType } from "../types/player";
import { Song } from "../models/song";

export const saveSongHistory = async (song: SongType) => {
  const record = new Song({
    requester: song.requester,
    thumbnail: song.thumbnail,
    title: song.title,
    url: song.videoId,
    date: new Date()
  });

  return record.save();
};
