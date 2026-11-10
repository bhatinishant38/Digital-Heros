
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

// Global cache
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  };
}

const dbConnect = async () => {
  // Already connected
  if (cached.conn) {
    console.log("Already connected to database");
    return cached.conn;
  }

  // Create connection only once
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log("DB Connected Successfully");

    return cached.conn;

  } catch (error) {
    cached.promise = null;
    console.error("DB connection failed:", error);
    throw error;
  }
};

export default dbConnect;
