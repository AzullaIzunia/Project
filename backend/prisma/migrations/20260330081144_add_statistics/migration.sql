/*
  Warnings:

  - Added the required column `all_stats` to the `FateResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FateResult" ADD COLUMN     "all_stats" JSONB NOT NULL,
ADD COLUMN     "lowest_stats" TEXT[];
