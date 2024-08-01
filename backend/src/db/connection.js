import "dotenv/config";
import mongoose from "mongoose";

export const connection = () => {
  return mongoose.connect(process.env.MONGODB_URI, {
    dbName: "social-media-db",
  });
};
