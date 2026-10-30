import mongoose from "mongoose";
import { config } from "./config.js";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);

    console.log("MongoDB connected successfully");
    console.log(`Database: ${mongoose.connection.name}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);

    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("MongoDB disconnect failed:", error);
  }
};