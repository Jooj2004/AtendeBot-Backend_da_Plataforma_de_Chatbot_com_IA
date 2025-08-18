/*
  Warnings:

  - You are about to drop the column `with` on the `Interaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Interaction" DROP COLUMN "with",
ADD COLUMN     "botOrFaq" INTEGER NOT NULL DEFAULT 1;
