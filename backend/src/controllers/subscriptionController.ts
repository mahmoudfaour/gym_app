import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const createSubscription = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // ✅ Check if the user exists
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(401).json({ error: 'User does not exist' });
    }

    const existingSubscription = await prisma.subscription.findFirst({
      where: { userId },
    });

    if (existingSubscription) {
      return res.status(400).json({ error: 'User already subscribed' });
    }

    const subscription = await prisma.subscription.create({
      data: {
        userId,
        planId: req.body.planId,
        createdAt: new Date(),
      },
    });

    res.json(subscription);
  } catch (error: any) {
    console.error('❌ Failed to create subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};
