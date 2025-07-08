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
import activitiesRouter from './routes/activitiesRoutes';
import dashboardRoutes from './routes/dashboardRoutes';




const app = express();

// Enable CORS for frontend origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // make sure PATCH is included
}));
app.options('*', cors()); // Allow preflight requests for all routes

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
app.use('/api/activities', activitiesRouter);
app.use('/api/dashboard', dashboardRoutes);



export default app;
