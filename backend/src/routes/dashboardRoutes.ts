// routes/dashboardRoutes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middlewares/authMiddleware'; // Adjust this path if needed

const router = Router();
const prisma = new PrismaClient();

router.get('/:id/metrics', authenticate, async (req, res) => {
  const userId = Number(req.params.id);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

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
        where: { userId },
      }),
      prisma.activityRecord.aggregate({
        _sum: { calories: true },
        where: { userId },
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
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
  }
});


router.get('/test', (req, res) => {
  res.send('Dashboard route works ✅');
});

export default router;
