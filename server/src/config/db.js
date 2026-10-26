import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    if (uri && !uri.includes('127.0.0.1') && !uri.includes('localhost')) {
      // Direct remote/Atlas connection
      console.log('Connecting to remote MongoDB (Atlas)...');
      await mongoose.connect(uri);
      console.log('MongoDB Atlas connected successfully.');
      return;
    }

    // Try connecting to provided URI (e.g. local or test)
    console.log(`Attempting to connect to MongoDB at: ${uri || 'default local'}...`);
    await mongoose.connect(uri || 'mongodb://127.0.0.1:27017/findit', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log('Local MongoDB connected successfully.');
  } catch (err) {
    console.warn('Could not connect to local MongoDB server:', err.message);

    // Development auto-fallback: In-memory MongoDB so the student can test immediately without installing mongod!
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('Spinning up development in-memory MongoDB runner (mongodb-memory-server)...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        await mongoose.connect(memUri);
        console.log(`Connected to In-Memory MongoDB for local development: ${memUri}`);
        console.log('Tip for Student: Set MONGODB_URI in your .env to use MongoDB Atlas in production.');
      } catch (memErr) {
        console.error('Failed to start in-memory MongoDB:', memErr.message);
        throw err;
      }
    } else {
      throw err;
    }
  }
};

export const closeDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
