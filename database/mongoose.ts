import mongoose from "mongoose";
import dns from "node:dns";
import { env } from "@/lib/env";

// Set DNS servers explicitly to resolve Atlas SRV records
console.log("DNS Servers:", dns.getServers());
dns.setServers(["1.1.1.1"]);
console.log("DNS Servers:", dns.getServers());

declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  const mongodbUri = env.mongodbUri;

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(mongodbUri, { bufferCommands: false });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  console.log(`Connected to database (${env.nodeEnv})`);

  return cached.conn;
};
