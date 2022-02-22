/*
  Warnings:

  - You are about to drop the column `sizesURLs` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the `PhotoSizes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PhotoSizes" DROP CONSTRAINT "PhotoSizes_photoId_fkey";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "sizesURLs";

-- DropTable
DROP TABLE "PhotoSizes";

-- CreateTable
CREATE TABLE "PhotoSize" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "photoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "publicURL" TEXT NOT NULL,

    CONSTRAINT "PhotoSize_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PhotoSize" ADD CONSTRAINT "PhotoSize_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Photo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
