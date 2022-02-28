-- AlterTable
ALTER TABLE "Gallery" ADD COLUMN     "updatedById" TEXT;

-- AddForeignKey
ALTER TABLE "Gallery" ADD CONSTRAINT "Gallery_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
