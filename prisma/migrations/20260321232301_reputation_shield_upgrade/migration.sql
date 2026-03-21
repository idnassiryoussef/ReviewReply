-- CreateEnum
CREATE TYPE "ReviewClassification" AS ENUM ('positive', 'neutral', 'negative', 'danger');

-- CreateEnum
CREATE TYPE "ReviewState" AS ENUM ('NEW', 'NEEDS_ATTENTION', 'DRAFT_READY', 'APPROVED', 'SENT', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ReplyStatus" AS ENUM ('SUGGESTED', 'APPROVED', 'SENT', 'FAILED');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'SKIPPED');

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "externalId" TEXT,
    "source" TEXT NOT NULL DEFAULT 'google',
    "authorName" TEXT,
    "rating" INTEGER NOT NULL,
    "reviewText" TEXT NOT NULL,
    "classification" "ReviewClassification" NOT NULL DEFAULT 'neutral',
    "state" "ReviewState" NOT NULL DEFAULT 'NEW',
    "needsAttention" BOOLEAN NOT NULL DEFAULT false,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reply" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "tone" TEXT NOT NULL DEFAULT 'professional',
    "publicReply" TEXT NOT NULL,
    "privateResolutionMessage" TEXT NOT NULL,
    "status" "ReplyStatus" NOT NULL DEFAULT 'SUGGESTED',
    "approvedAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reply_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AutomationSettings" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "autoReplyStarRatings" INTEGER[] DEFAULT ARRAY[4, 5]::INTEGER[],
    "delayMinutes" INTEGER NOT NULL DEFAULT 5,
    "dailyReplyLimit" INTEGER NOT NULL DEFAULT 10,
    "dryRunMode" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutomationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobLog" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "replyId" TEXT,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "skipReason" TEXT,
    "runAt" TIMESTAMP(3),
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Review_businessId_createdAt_idx" ON "Review"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "Review_businessId_classification_createdAt_idx" ON "Review"("businessId", "classification", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_businessId_externalId_key" ON "Review"("businessId", "externalId");

-- CreateIndex
CREATE INDEX "Reply_businessId_createdAt_idx" ON "Reply"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "Reply_reviewId_createdAt_idx" ON "Reply"("reviewId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AutomationSettings_businessId_key" ON "AutomationSettings"("businessId");

-- CreateIndex
CREATE INDEX "AutomationSettings_businessId_idx" ON "AutomationSettings"("businessId");

-- CreateIndex
CREATE INDEX "JobLog_businessId_createdAt_idx" ON "JobLog"("businessId", "createdAt");

-- CreateIndex
CREATE INDEX "JobLog_businessId_status_createdAt_idx" ON "JobLog"("businessId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "JobLog_reviewId_createdAt_idx" ON "JobLog"("reviewId", "createdAt");

-- AddForeignKey
ALTER TABLE "Reply" ADD CONSTRAINT "Reply_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLog" ADD CONSTRAINT "JobLog_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobLog" ADD CONSTRAINT "JobLog_replyId_fkey" FOREIGN KEY ("replyId") REFERENCES "Reply"("id") ON DELETE SET NULL ON UPDATE CASCADE;
