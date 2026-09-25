import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';


const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        console.error('Database connection error:', err);
        res.status(500).json({ message: 'Database connection failed', error: err.message });
    }
});

// Routes
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;