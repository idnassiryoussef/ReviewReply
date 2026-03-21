-- Rename Stripe-oriented subscription columns to Paddle-oriented names
ALTER TABLE "Subscription" RENAME COLUMN "stripeCustomerId" TO "paddleCustomerId";
ALTER TABLE "Subscription" RENAME COLUMN "stripePriceId" TO "paddlePriceId";
ALTER TABLE "Subscription" RENAME COLUMN "stripeSubscriptionId" TO "paddleSubscriptionId";
