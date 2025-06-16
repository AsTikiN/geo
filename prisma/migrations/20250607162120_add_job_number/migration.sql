/*
  Warnings:

  - A unique constraint covering the columns `[jobNumber]` on the table `Pit` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Pit" ADD COLUMN "jobNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Pit_jobNumber_key" ON "Pit"("jobNumber");
