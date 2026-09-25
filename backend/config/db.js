import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined in Vercel Environment Variables or backend/.env.');
    }
    const db = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        bufferCommands: false,
    });
    isConnected = db.connections[0].readyState;
    console.log('DB connected');
};

