export type ExternalReview = {
  externalId: string;
  source: "google";
  authorName: string;
  rating: number;
  reviewText: string;
  receivedAt: Date;
};

export type PostReplyInput = {
  externalReviewId: string;
  publicReply: string;
};

export type PostReplyResult = {
  ok: boolean;
  providerMessage: string;
  sentAt?: Date;
};

const MOCK_REVIEWS: ExternalReview[] = [
  {
    externalId: "g-1001",
    source: "google",
    authorName: "Sarah M.",
    rating: 5,
    reviewText:
      "Amazing service and very friendly staff. We had a great time and will definitely come back.",
    receivedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    externalId: "g-1002",
    source: "google",
    authorName: "Karim L.",
    rating: 3,
    reviewText:
      "Good overall but we waited too long before someone helped us. Food quality was fine.",
    receivedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    externalId: "g-1003",
    source: "google",
    authorName: "Anonymous",
    rating: 1,
    reviewText:
      "Worst experience ever. I am considering legal action after what happened to my family.",
    receivedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

export interface GoogleReviewsService {
  fetchReviews(businessId: string): Promise<ExternalReview[]>;
  postReply(input: PostReplyInput): Promise<PostReplyResult>;
}

class MockGoogleReviewsService implements GoogleReviewsService {
  async fetchReviews(businessId: string): Promise<ExternalReview[]> {
    void businessId;
    return MOCK_REVIEWS;
  }

  async postReply(input: PostReplyInput): Promise<PostReplyResult> {
    if (!input.externalReviewId || !input.publicReply.trim()) {
      return {
        ok: false,
        providerMessage: "Invalid reply payload",
      };
    }

    return {
      ok: true,
      providerMessage: "Mock reply published",
      sentAt: new Date(),
    };
  }
}

export const googleReviewsService: GoogleReviewsService = new MockGoogleReviewsService();
