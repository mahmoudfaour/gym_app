import express from 'express';
import cors from 'cors';
import path from 'path';

// Route imports
import userRoutes from './routes/userRoutes';
import planRoutes from './routes/planRoutes';
import authRoutes from './routes/authRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import nutritionRoutes from './routes/nutritionRoutes';
import workoutRoutes from './routes/workoutRoutes';


const app = express();

// Enable CORS for frontend origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT'],
}));

// Middleware to parse JSON
app.use(express.json());

// ✅ Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Mount API routes
app.use('/api/users', userRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/nutrition', nutritionRoutes);
// Use the workout routes
app.use('/api/workouts', workoutRoutes);


export default app;
