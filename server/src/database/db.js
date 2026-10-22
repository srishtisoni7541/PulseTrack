
import mongoose from "mongoose";
import { env } from "../config/env.js";

export async function connectMongo() {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  console.info("MongoDB connection established");
}

export function isMongoReady() {
  return mongoose.connection.readyState === 1;
}

export async function disconnectMongo() {
  await mongoose.disconnect();
}