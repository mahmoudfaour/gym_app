import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

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
router.post('/record', async (req, res) => {
  const { userId, activityId, duration } = req.body;

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
