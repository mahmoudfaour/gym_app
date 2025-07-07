// src/routes/subscriptionRoutes.ts
import express from 'express';
import { createSubscription } from '../controllers/subscriptionController';
import { authenticate } from '../middlewares/authMiddleware';

const router = express.Router();

// Protect this route so only logged-in users can create subscriptions
router.post('/', authenticate, createSubscription); // ✅ handles POST /subscriptions





export default router;
