-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "description" TEXT,
ADD COLUMN     "galleryPhotoHeaderId" TEXT;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_galleryPhotoHeaderId_fkey" FOREIGN KEY ("galleryPhotoHeaderId") REFERENCES "Photo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
