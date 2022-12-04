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
  date: {
    type: Date,
    required: true,
  },
});

const song = model("Song", schema);

export { song };
