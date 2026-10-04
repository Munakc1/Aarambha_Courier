import mongoose from "mongoose";

// how this works: opens the Mongoose connection. Call once at boot.
export async function connectDb(uri: string): Promise<void> {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  console.log("✔ MongoDB connected");
}
