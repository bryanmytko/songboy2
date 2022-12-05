import { model, Schema } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  songs: [
    {
      requester: String,
      url: String,
      title: String,
      img: String,
      source: String,
    },
  ],
  message: {
    channel: String,
    guild: {
      id: Number,
    },
    member: {
      voice: {
        channel: String,
      },
    },
  },
});

const Playlist = model("Playlist", schema);

export { Playlist };
