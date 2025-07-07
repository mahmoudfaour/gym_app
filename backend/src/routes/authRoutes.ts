// src/routes/authRoutes.ts
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { loginStep1 } from '../controllers/twoStepAuthController'; // 👈 import login controller
import { loginStep2 } from '../controllers/twoStepAuthController'; // 👈 import login controller

import { login } from '../controllers/authController'; // 👈 import login controller


const router = Router();
const prisma = new PrismaClient();

router.post('/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    console.error(error); // 👈 Check this in your terminal
    res.status(500).json({ error: 'User creation failed' });
  }
});

// 👇 use the imported controller here
router.post('/login', login);
router.post('/login-step1', loginStep1); // 🔐 email/password, send code
router.post('/login-step2', loginStep2); // ✅ verify code, issue JWT

export default router;
