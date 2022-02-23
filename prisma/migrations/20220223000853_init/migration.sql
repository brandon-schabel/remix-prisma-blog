/*
  Warnings:

  - You are about to drop the column `assetId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Photo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "assetId",
DROP COLUMN "name";
