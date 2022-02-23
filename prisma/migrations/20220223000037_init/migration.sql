/*
  Warnings:

  - Added the required column `assetId` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bytes` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `etag` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `secureUrl` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `signature` to the `Photo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "assetId" TEXT NOT NULL,
ADD COLUMN     "bytes" INTEGER NOT NULL,
ADD COLUMN     "etag" TEXT NOT NULL,
ADD COLUMN     "secureUrl" TEXT NOT NULL,
ADD COLUMN     "signature" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL;
