-- CreateEnum
CREATE TYPE "AutoReplyJobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "AutoReplySettings" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "replyOnStars" INTEGER[] DEFAULT ARRAY[5]::INTEGER[],
    "quietHoursStart" TEXT NOT NULL DEFAULT '22:00',
    "quietHoursEnd" TEXT NOT NULL DEFAULT '08:00',
    "dryRunMode" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutoReplySettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutoReplyJob" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "status" "AutoReplyJobStatus" NOT NULL DEFAULT 'PENDING',
    "generatedReply" TEXT NOT NULL DEFAULT '',
    "publishedAt" TIMESTAMP(3),
    "skipReason" TEXT,
    "reviewStars" INTEGER,
    "reviewText" TEXT,
    "reviewSnippet" TEXT,
    "attempt" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutoReplyJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AutoReplySettings_businessId_key" ON "AutoReplySettings"("businessId");

-- CreateIndex
CREATE INDEX "AutoReplySettings_businessId_idx" ON "AutoReplySettings"("businessId");

-- CreateIndex
CREATE INDEX "AutoReplyJob_businessId_createdAt_idx" ON "AutoReplyJob"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "AutoReplyJob_businessId_reviewId_createdAt_idx" ON "AutoReplyJob"("businessId", "reviewId", "createdAt");
