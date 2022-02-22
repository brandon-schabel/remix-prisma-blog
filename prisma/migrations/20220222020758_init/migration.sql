/*
  Warnings:

  - You are about to drop the column `publicUrl` on the `Photo` table. All the data in the column will be lost.
  - Added the required column `publicURL` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "publicUrl",
ADD COLUMN     "publicURL" TEXT NOT NULL;
