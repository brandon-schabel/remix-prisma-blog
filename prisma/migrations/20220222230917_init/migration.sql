/*
  Warnings:

  - The primary key for the `PhotoSize` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "sizesMap" JSONB;

-- AlterTable
ALTER TABLE "PhotoSize" DROP CONSTRAINT "PhotoSize_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "PhotoSize_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "PhotoSize_id_seq";
