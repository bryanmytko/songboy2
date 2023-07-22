import mongoose from "mongoose";
require("dotenv").config();

export const connect = async () => {
  try {
    const { MONGO_TEST_URL } = process.env;
    void mongoose.connect(MONGO_TEST_URL || "", { autoCreate: true });
  } catch (e) {
    console.log("DB failed to connect!");
  }
};

export const clear = async () => {
  try {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  } catch (e) {
    console.log("DB failed to clear!");
  }
}

export const disconnect = async () => {
  try {
    await mongoose.connection.close();
  } catch (e) {
    console.log("DB failed to disconnect properly!");
  }
};
