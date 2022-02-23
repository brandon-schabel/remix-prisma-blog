/*
  Warnings:

  - You are about to drop the column `bucket` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `fileKey` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `filename` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `publicURL` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `sizesMap` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the `PhotoSize` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `format` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `height` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `originalFilename` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PhotoSize" DROP CONSTRAINT "PhotoSize_photoId_fkey";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "bucket",
DROP COLUMN "fileKey",
DROP COLUMN "filename",
DROP COLUMN "publicURL",
DROP COLUMN "sizesMap",
ADD COLUMN     "format" TEXT NOT NULL,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "originalFilename" TEXT NOT NULL,
ADD COLUMN     "publicId" TEXT NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;

-- DropTable
DROP TABLE "PhotoSize";
