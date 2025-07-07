import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

router.post('/', authenticate, async (req: AuthRequest, res) => {
const { calories, protein, date } = req.body;
  const userId = req.user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    await prisma.nutritionEntry.create({
      data: {
        userId,
        calories,
        protein, 
        date: new Date(date),
      },
    });
    res.json({ message: 'Entry saved.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save nutrition data.' });
  }
});

export default router;
