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
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Use multer to handle image upload
const upload = multer({ dest: uploadDir });

// GET all users with subscriptions and plans
router.get('/', async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        subscriptions: {
          include: { plan: true },
        },
      },
    });

    const sanitized = users.map(({ password, ...rest }) => rest);
    res.json(sanitized);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET user by ID
router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid ID' });

  try {
    const user = await prisma.user.findUnique({
      where: { id },
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
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// POST: Upload and update profile image (⚠️ matches frontend!)
router.post(
  '/profile-image',
  authenticate,
  upload.single('image'), // must match frontend's formData.append('image', ...)
  async (req: AuthRequest, res) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user?.id;
    const imageUrl = `/uploads/${req.file.filename}`; // served statically

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      await prisma.user.update({
        where: { id: userId },
        data: { profileImage: imageUrl },
      });

      res.json({ message: 'Profile image updated', imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to update profile image' });
    }
  }
);

export default router;
