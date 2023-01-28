import { model, Schema } from "mongoose";

interface ISongCount {
  title: string;
  count: number;
}

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

const random = async () => {
  const count = await Song.countDocuments();
  const random = Math.floor(Math.random() * count);

  return Song.findOne().skip(random);
};

const topTen = async (): Promise<ISongCount[]> =>
  await Song.aggregate([
    { $group: { _id: "$title", count: { $sum: 1 } } },
    { $sort: { count: -1 } },

    {
      $group: { _id: 1, title: { $push: { title: "$_id", count: "$count" } } },
    },
    {
      $project: {
        first: { $arrayElemAt: ["$title", 0] },
        second: { $arrayElemAt: ["$title", 1] },
        third: { $arrayElemAt: ["$title", 2] },
        fourth: { $arrayElemAt: ["$title", 3] },
        fifth: { $arrayElemAt: ["$title", 4] },
        sixth: { $arrayElemAt: ["$title", 5] },
        seventh: { $arrayElemAt: ["$title", 6] },
        eighth: { $arrayElemAt: ["$title", 7] },
        ninth: { $arrayElemAt: ["$title", 8] },
        tenth: { $arrayElemAt: ["$title", 9] },
      },
    },

    {
      $project: {
        status: [
          "$first",
          "$second",
          "$third",
          "$fourth",
          "$fifth",
          "$sixth",
          "$seventh",
          "$eighth",
          "$ninth",
          "$tenth",
        ],
      },
    },

    { $unwind: "$status" },
    { $project: { _id: 0, title: "$status.title", count: "$status.count" } },
  ]);

export { Song, random, topTen, ISongCount };
