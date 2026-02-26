import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();

// Connect to database
await connectDB();

const app = express();

// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1 && process.env.NODE_ENV === 'production') {
            // In production, we might want to be stricter, but for now let's allow the vercel domain
            return callback(null, true);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());

// Routes
import userRoutes from './routes/userRoutes.js';
app.use('/api/users', userRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
