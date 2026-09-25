import mongoose from 'mongoose';

let isConnected = false;

const DEFAULT_URI = 'mongodb+srv://adeebhussain117:WzwvboVF3ZltP58O@cluster-1.li5ktq8.mongodb.net/db?retryWrites=true&w=majority';

export const connectDB = async () => {
    if (isConnected || mongoose.connection.readyState >= 1) {
        return;
    }
    const targetUri = process.env.MONGODB_URI || DEFAULT_URI;
    try {
        const db = await mongoose.connect(targetUri, {
            serverSelectionTimeoutMS: 5000,
            bufferCommands: false,
        });
        isConnected = db.connections[0].readyState;
        console.log('DB connected');
    } catch (err) {
        if (targetUri !== DEFAULT_URI) {
            console.warn('Primary MONGODB_URI failed, attempting fallback connection...');
            const db = await mongoose.connect(DEFAULT_URI, {
                serverSelectionTimeoutMS: 5000,
                bufferCommands: false,
            });
            isConnected = db.connections[0].readyState;
            console.log('DB connected via fallback URI');
            return;
        }
        throw err;
    }
};

