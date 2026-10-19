import mongoose from 'mongoose';
import { env } from './env.js';

let isConnected = false;

export async function connectDB(fastifyLogger = console) {
  if (isConnected) {
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    isConnected = true;
    fastifyLogger.info(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (error) {
    fastifyLogger.error(`MongoDB Connection Error: ${error.message}`);
    // Don't kill process immediately so app can still report health status or run with mock/seed
    return null;
  }
}

export async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
  }
}

export function isDbConnected() {
  return mongoose.connection.readyState === 1;
}
