import mongoose from 'mongoose';

/**
 * Connects to MongoDB using MONGODB_URI from environment.
 * Call once at application startup.
 */
export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('Missing MONGODB_URI in environment variables');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(uri);
  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
}
