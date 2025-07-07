import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';


console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS); 

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const loginStep1 = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.verificationCode.create({
      data: {
        userId: user.id,
        code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Your verification code',
      text: `Your 2FA code is: ${code}`,
    });

    res.json({ message: 'Verification code sent to email.' });
  } catch (err) {
    console.error('Login Step 1 error:', err);
    res.status(500).json({ error: 'Server error during login step 1' });
  }
};

export const loginStep2 = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { subscriptions: true },
    });
    if (!user) return res.status(401).json({ error: 'User not found' });

    const validCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code,
        expiresAt: { gte: new Date() },
      },
    });

    if (!validCode) {
      return res.status(401).json({ error: 'Invalid or expired code' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
    await prisma.verificationCode.deleteMany({ where: { userId: user.id } });

    res.json({ token, isSubscribed: !!user.subscriptions?.length });
  } catch (err) {
    console.error('Login Step 2 error:', err);
    res.status(500).json({ error: 'Server error during login step 2' });
  }
};
