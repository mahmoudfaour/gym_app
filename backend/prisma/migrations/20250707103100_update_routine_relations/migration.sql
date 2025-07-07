/*
  Warnings:

  - You are about to drop the `WorkoutRoutineLink` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `workoutId` to the `WorkoutRoutine` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "WorkoutRoutineLink" DROP CONSTRAINT "WorkoutRoutineLink_routineId_fkey";

-- DropForeignKey
ALTER TABLE "WorkoutRoutineLink" DROP CONSTRAINT "WorkoutRoutineLink_workoutId_fkey";

-- AlterTable
ALTER TABLE "WorkoutRoutine" ADD COLUMN     "workoutId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "WorkoutRoutineLink";

-- AddForeignKey
ALTER TABLE "WorkoutRoutine" ADD CONSTRAINT "WorkoutRoutine_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
