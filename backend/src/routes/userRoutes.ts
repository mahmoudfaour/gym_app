// src/routes/userRoutes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate, AuthRequest } from '../middlewares/authMiddleware';

const router = Router();
const prisma = new PrismaClient();

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up multer for file uploads
const upload = multer({ dest: uploadDir });

// GET all users with subscriptions and plans (excluding passwords)
router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });

    const sanitizedUsers = users.map(({ password, ...rest }) => rest);
    res.json(sanitizedUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET single user by ID
router.get('/:id', async (req, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const { password, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// PATCH: Update user optional profile attributes
router.patch('/:id', authenticate, async (req: AuthRequest, res) => {
  const userId = parseInt(req.params.id, 10);
  if (isNaN(userId)) return res.status(400).json({ error: 'Invalid user ID' });

  const { height, weight, age } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        height: height ?? undefined,
        weight: weight ?? undefined,
        age: age ?? undefined,
      },
    });

    const { password, ...safeUser } = updatedUser;
    res.json(safeUser);
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ error: 'Failed to update user profile' });
  }
});

// POST: Upload and update user profile image
router.post(
  '/profile-image',
  authenticate,
  upload.single('image'),
  async (req: AuthRequest, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file uploaded' });
    }

    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const imageUrl = `/uploads/${req.file.filename}`;

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { profileImage: imageUrl },
      });

      res.json({ message: 'Profile image updated successfully', imageUrl });
    } catch (err) {
      console.error('Error updating profile image:', err);
      res.status(500).json({ error: 'Failed to update profile image' });
    }
  }
);




export default router;
