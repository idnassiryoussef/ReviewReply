export type SentimentLabel = "positive" | "neutral" | "negative" | "danger";

export type InboxReviewItem = {
  id: string;
  externalId: string | null;
  source: string;
  authorName: string | null;
  rating: number;
  reviewText: string;
  classification: SentimentLabel;
  needsAttention: boolean;
  state: "NEW" | "NEEDS_ATTENTION" | "DRAFT_READY" | "APPROVED" | "SENT" | "RESOLVED";
  receivedAt: string;
  publicReply: string | null;
  privateResolutionMessage: string | null;
  replyStatus: "SUGGESTED" | "APPROVED" | "SENT" | "FAILED" | null;
  tone: "friendly" | "professional" | "apologetic";
};
