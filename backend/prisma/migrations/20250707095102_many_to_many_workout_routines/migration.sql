/*
  Warnings:

  - You are about to drop the column `workoutId` on the `WorkoutRoutine` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkoutRoutine" DROP CONSTRAINT "WorkoutRoutine_workoutId_fkey";

-- AlterTable
ALTER TABLE "WorkoutRoutine" DROP COLUMN "workoutId";

-- CreateTable
CREATE TABLE "WorkoutRoutineLink" (
    "workoutId" INTEGER NOT NULL,
    "routineId" INTEGER NOT NULL,

    CONSTRAINT "WorkoutRoutineLink_pkey" PRIMARY KEY ("workoutId","routineId")
);

-- AddForeignKey
ALTER TABLE "WorkoutRoutineLink" ADD CONSTRAINT "WorkoutRoutineLink_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutRoutineLink" ADD CONSTRAINT "WorkoutRoutineLink_routineId_fkey" FOREIGN KEY ("routineId") REFERENCES "WorkoutRoutine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
