import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { connectDB } from './config/db.js';
import userRouter from './routes/userRoutes.js';
import taskRouter from './routes/taskRoutes.js';


const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//db CONNECT
connectDB();

// Routes
app.use('/api/user', userRouter);
app.use('/api/task', taskRouter);


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.listen( PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});