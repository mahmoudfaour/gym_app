import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// ✅ GET /api/activities - Fetch all activities
router.get('/', async (_req, res) => {
  try {
    const activities = await prisma.activity.findMany();
    res.json(activities);
  } catch (err) {
    console.error('Error fetching activities:', err);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// ✅ POST /api/activities/record - Log an activity performed by a user
router.post('/record', authenticate, async (req: AuthRequest, res) => {
  const { activityId, duration } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
  }

  try {
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const calories = activity.caloriesPerMinute * duration;

    const record = await prisma.activityRecord.create({
      data: {
        userId,
        activityId,
        duration,
        calories,
      },
    });

    res.status(201).json({ message: 'Activity recorded', record });
  } catch (err) {
    console.error('Error recording activity:', err);
    res.status(500).json({ error: 'Failed to record activity' });
  }
});

export default router;
