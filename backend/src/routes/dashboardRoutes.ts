// src/routes/dashboardRoutes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// ✅ SECURE: Get dashboard metrics for the logged-in user
router.get('/metrics', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: missing user ID' });
  }

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  try {
    const [nutritionToday, workoutCalories, activityCalories] = await Promise.all([
      prisma.nutritionEntry.aggregate({
        _sum: { calories: true, protein: true },
        where: {
          userId,
          date: { gte: today, lt: tomorrow },
        },
      }),
      prisma.workoutRecord.aggregate({
        _sum: { calories: true },
        where: {
          userId,
          completedAt: { gte: today, lt: tomorrow },
        },
      }),
      prisma.activityRecord.aggregate({
        _sum: { calories: true },
        where: {
          userId,
          createdAt: { gte: today, lt: tomorrow },
        },
      }),
    ]);

    const totalCaloriesBurned =
      (workoutCalories._sum.calories ?? 0) + (activityCalories._sum.calories ?? 0);

    res.json({
      caloriesBurned: totalCaloriesBurned,
      dailyCalories: nutritionToday._sum.calories ?? 0,
      dailyProtein: nutritionToday._sum.protein ?? 0,
    });
  } catch (err) {
    console.error('Error fetching dashboard metrics:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});

// ✅ Simple test route to confirm this file is mounted
router.get('/test', (_req, res) => {
  res.send('Dashboard route works ✅');
});

// ✅ Optional debug route (keep if needed)
router.get('/debug', authenticate, async (req: AuthRequest, res) => {
  const userId = req.user?.id;

  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  const workoutRecords = await prisma.workoutRecord.findMany({
    where: {
      userId,
      completedAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  const activityRecords = await prisma.activityRecord.findMany({
    where: {
      userId,
      createdAt: {
        gte: today,
        lt: tomorrow,
      },
    },
  });

  res.json({
    today: today.toISOString(),
    tomorrow: tomorrow.toISOString(),
    workoutRecords,
    activityRecords,
  });
});

export default router;
