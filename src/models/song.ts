import { model, Schema } from "mongoose";

const schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  requester: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Song = model("Song", schema);

export { Song };
