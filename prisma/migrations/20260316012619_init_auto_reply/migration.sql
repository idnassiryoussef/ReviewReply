/*
  Warnings:

  - You are about to drop the column `attempt` on the `AutoReplyJob` table. All the data in the column will be lost.
  - The `status` column on the `AutoReplyJob` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "AutoReplyJob" DROP COLUMN "attempt",
ADD COLUMN     "errorMessage" TEXT,
ADD COLUMN     "retryCount" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "status",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "generatedReply" DROP NOT NULL,
ALTER COLUMN "generatedReply" DROP DEFAULT;

-- DropEnum
DROP TYPE "AutoReplyJobStatus";
