/*
  Warnings:

  - Added the required column `calorieRatio` to the `WorkoutRoutine` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutRoutine" ADD COLUMN     "calorieRatio" DOUBLE PRECISION NOT NULL;
