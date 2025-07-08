import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// 🔄 GET all workouts
router.get('/', async (_req, res) => {
  try {
    const workouts = await prisma.workout.findMany();
    res.json(workouts);
  } catch (err) {
    console.error('❌ Error fetching workouts:', err);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

router.post('/custom', async (req, res) => {
  const { title, type, difficulty, duration, image, routines } = req.body;

  try {
    const calorieSum = routines.reduce((sum: number, r: any) => sum + r.calorieRatio, 0);

    // 🔥 Convert calorie sum to real kcal (assume 100 = 1 ratio unit)
    const totalCalories = Math.round(calorieSum * 100); // e.g. 0.4 + 0.8 = 1.2 * 100 = 120

    const workout = await prisma.workout.create({
      data: {
        title,
        type,
        difficulty,
        duration: Number(duration),
        calories: totalCalories,
        image,
        routines: {
          create: routines.map((r: any) => ({
            name: r.name,
            sets: r.sets,
            reps: r.reps,
            rest: r.rest,
            calorieRatio: r.calorieRatio,
          })),
        },
      },
      include: { routines: true },
    });

    res.status(201).json(workout);
  } catch (err) {
    console.error('❌ Error creating workout with routines:', err);
    res.status(500).json({ error: 'Failed to create workout' });
  }
});


// ✅ GET a specific workout by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const workout = await prisma.workout.findUnique({
      where: { id: Number(id) },
      include: { routines: true },
    });

    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    res.json(workout);
  } catch (error) {
    console.error('❌ Error fetching workout by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ✅ GET all routines for a specific workout
router.get('/:id/routines', async (req, res) => {
  const { id } = req.params;

  try {
    const routines = await prisma.workoutRoutine.findMany({
      where: {
        workoutId: Number(id),
      },
    });

    res.json(routines);
  } catch (err) {
    console.error('❌ Error fetching workout routines:', err);
    res.status(500).json({ error: 'Failed to fetch routines' });
  }
});

router.post('/complete', async (req, res) => {
  const { userId, workoutId } = req.body;

  try {
    const workout = await prisma.workout.findUnique({ where: { id: workoutId } });
    if (!workout) {
      return res.status(404).json({ error: 'Workout not found' });
    }

    const record = await prisma.workoutRecord.create({
      data: {
        userId,
        workoutId,
        calories: workout.calories,
      },
    });

    res.status(201).json(record);
  } catch (err) {
    console.error('❌ Error completing workout:', err);
    res.status(500).json({ error: 'Failed to complete workout' });
  }
});

//this route is used to track the daily burned calories
router.get('/calories/:userId', async (req, res) => {
  const { userId } = req.params;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const calories = await prisma.workoutRecord.aggregate({
      _sum: {
        calories: true,
      },
      where: {
        userId: Number(userId),
        completedAt: {
          gte: today,
        },
      },
    });

    res.json({ totalCaloriesBurnedToday: calories._sum.calories || 0 });
  } catch (err) {
    console.error('Error calculating daily calories:', err);
    res.status(500).json({ error: 'Failed to calculate calories' });
  }
});


export default router;
