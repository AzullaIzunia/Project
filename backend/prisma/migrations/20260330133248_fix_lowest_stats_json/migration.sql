/*
  Warnings:

  - Changed the type of `lowest_stats` on the `FateResult` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "FateResult" DROP COLUMN "lowest_stats",
ADD COLUMN     "lowest_stats" JSONB NOT NULL;
