-- AlterTable
ALTER TABLE "AutoReplyJob" ADD COLUMN     "detectedLanguage" TEXT DEFAULT 'en';

-- AlterTable
ALTER TABLE "AutoReplySettings" ADD COLUMN     "customInstructions" TEXT,
ADD COLUMN     "maxRepliesPerDay" INTEGER NOT NULL DEFAULT 50,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC',
ADD COLUMN     "tonePerStar" JSONB NOT NULL DEFAULT '{"1":"apologetic","2":"apologetic","3":"neutral","4":"grateful","5":"enthusiastic"}';

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "stripeCustomerId" TEXT,
    "stripePriceId" TEXT,
    "stripeSubscriptionId" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodEnd" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_businessId_key" ON "Subscription"("businessId");
