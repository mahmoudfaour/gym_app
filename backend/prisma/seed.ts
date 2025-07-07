import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createWorkoutWithCalories({
  title,
  type,
  difficulty,
  duration,
  image,
  totalCalories,
  routines,
}: {
  title: string;
  type: string;
  difficulty: string;
  duration: number;
  image: string;
  totalCalories: number;
  routines: {
    name: string;
    sets: number;
    reps: number;
    rest: number;
    calorieRatio: number;
  }[];
}) {
  const ratioSum = routines.reduce((sum, r) => sum + r.calorieRatio, 0);
  if (Math.abs(ratioSum - 1) > 0.001) {
    throw new Error(`Routine calorie ratios for "${title}" must sum to 1.0 (got ${ratioSum})`);
  }

  await prisma.workout.create({
    data: {
      title,
      type,
      difficulty,
      duration,
      calories: totalCalories,
      image,
      routines: {
        create: routines.map((r) => ({
          name: r.name,
          sets: r.sets,
          reps: r.reps,
          rest: r.rest,
          calorieRatio: r.calorieRatio,
        })),
      },
    },
  });
}

async function main() {
  await prisma.workoutRoutine.deleteMany();
  await prisma.workout.deleteMany();
  await prisma.plan.deleteMany();

  await prisma.plan.createMany({
    data: [
      { title: 'Basic Plan', price: 20, duration: 30 },
      { title: 'Premium Plan', price: 50, duration: 90 },
      { title: 'Pro Plan', price: 100, duration: 180 },
    ],
  });

  await createWorkoutWithCalories({
    title: 'Full Body Burn',
    type: 'Bodyweight',
    difficulty: 'beginner',
    duration: 20,
    image: '/images/workouts/full_body_burn.jpg',
    totalCalories: 150,
    routines: [
      { name: 'Jumping Jacks', sets: 3, reps: 20, rest: 30, calorieRatio: 0.2 },
      { name: 'Push-ups (Knees)', sets: 3, reps: 10, rest: 45, calorieRatio: 0.25 },
      { name: 'Bodyweight Squats', sets: 3, reps: 15, rest: 45, calorieRatio: 0.2 },
      { name: 'Plank Hold', sets: 3, reps: 30, rest: 30, calorieRatio: 0.15 },
      { name: 'Mountain Climbers', sets: 3, reps: 20, rest: 30, calorieRatio: 0.2 },
    ],
  });

  await createWorkoutWithCalories({
    title: 'Machine Strength',
    type: 'Machine',
    difficulty: 'intermediate',
    duration: 35,
    image: '/images/workouts/machine_strength.jpg',
    totalCalories: 250,
    routines: [
      { name: 'Chest Press Machine', sets: 4, reps: 12, rest: 60, calorieRatio: 0.2 },
      { name: 'Leg Press Machine', sets: 4, reps: 12, rest: 60, calorieRatio: 0.2 },
      { name: 'Lat Pulldown', sets: 3, reps: 10, rest: 60, calorieRatio: 0.2 },
      { name: 'Seated Row Machine', sets: 3, reps: 12, rest: 60, calorieRatio: 0.2 },
      { name: 'Leg Curl Machine', sets: 3, reps: 15, rest: 45, calorieRatio: 0.2 },
    ],
  });

  await createWorkoutWithCalories({
    title: 'HIIT Max Pro',
    type: 'Bodyweight',
    difficulty: 'pro',
    duration: 45,
    image: '/images/workouts/hiit_max.jpg',
    totalCalories: 400,
    routines: [
      { name: 'Burpees', sets: 4, reps: 15, rest: 30, calorieRatio: 0.25 },
      { name: 'Jump Lunges', sets: 4, reps: 20, rest: 30, calorieRatio: 0.2 },
      { name: 'Pike Push-ups', sets: 4, reps: 12, rest: 45, calorieRatio: 0.15 },
      { name: 'High Knees', sets: 4, reps: 30, rest: 20, calorieRatio: 0.2 },
      { name: 'Plank to Push-up', sets: 3, reps: 15, rest: 30, calorieRatio: 0.2 },
    ],
  });

  await createWorkoutWithCalories({
    title: 'Push & Pull',
    type: 'Machine',
    difficulty: 'beginner',
    duration: 25,
    image: '/images/workouts/push_pull.jpg',
    totalCalories: 180,
    routines: [
      { name: 'Chest Press Machine', sets: 3, reps: 12, rest: 60, calorieRatio: 0.3 },
      { name: 'Seated Cable Row', sets: 3, reps: 12, rest: 60, calorieRatio: 0.25 },
      { name: 'Assisted Pull-ups', sets: 3, reps: 10, rest: 60, calorieRatio: 0.2 },
      { name: 'Dumbbell Lateral Raise', sets: 3, reps: 12, rest: 45, calorieRatio: 0.25 },
    ],
  });

  await createWorkoutWithCalories({
    title: 'Cardio Express',
    type: 'Bodyweight',
    difficulty: 'intermediate',
    duration: 30,
    image: '/images/workouts/cardio_express.jpg',
    totalCalories: 220,
    routines: [
      { name: 'Skaters', sets: 4, reps: 20, rest: 30, calorieRatio: 0.25 },
      { name: 'High Knees', sets: 4, reps: 30, rest: 20, calorieRatio: 0.25 },
      { name: 'Jump Squats', sets: 4, reps: 15, rest: 30, calorieRatio: 0.25 },
      { name: 'Burpees', sets: 4, reps: 10, rest: 30, calorieRatio: 0.25 },
    ],
  });

  await createWorkoutWithCalories({
    title: 'Chest & Back',
    type: 'Machine',
    difficulty: 'pro',
    duration: 50,
    image: '/images/workouts/chest_back.jpg',
    totalCalories: 450,
    routines: [
      { name: 'Incline Chest Press', sets: 4, reps: 10, rest: 60, calorieRatio: 0.2 },
      { name: 'Pec Deck Fly', sets: 4, reps: 12, rest: 60, calorieRatio: 0.2 },
      { name: 'Cable Crossover', sets: 3, reps: 15, rest: 45, calorieRatio: 0.2 },
      { name: 'Lat Pulldown', sets: 4, reps: 10, rest: 60, calorieRatio: 0.2 },
      { name: 'Seated Row Machine', sets: 4, reps: 12, rest: 60, calorieRatio: 0.2 },
    ],
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
