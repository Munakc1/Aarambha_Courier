import dotenv from "dotenv";

dotenv.config();

const requiredEnv = (name: string): string => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
};

export const config = {
  port: Number(process.env.PORT) || 5000,

  mongoUri: requiredEnv("MONGO_URI"),

  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  nodeEnv: process.env.NODE_ENV || "development",
};