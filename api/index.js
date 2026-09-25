import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from '../backend/config/db.js';
import userRouter from '../backend/routes/userRoutes.js';
import taskRouter from '../backend/routes/taskRoutes.js';

const app = express();

// Enable CORS for all origins and options preflight
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure DB connected before processing routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Database connection failed. Please check MONGODB_URI or MongoDB Atlas IP Whitelist (0.0.0.0/0).', 
            error: err.message 
        });
    }
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.get('/', (req, res) => {
    res.json({ success: true, message: 'TaskFlow API is running...' });
});

export default app;
