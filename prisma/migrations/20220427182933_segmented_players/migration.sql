/*
  Warnings:

  - You are about to drop the column `players` on the `Depth` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Depth" DROP COLUMN "players",
ADD COLUMN     "defenders" TEXT[],
ADD COLUMN     "forwards" TEXT[],
ADD COLUMN     "goalkeepers" TEXT[],
ADD COLUMN     "midfielders" TEXT[];
