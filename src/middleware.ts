import { NextResponse } from "next/server";
import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  buildPlanSnapshot,
  buildUpdatedPublicMetadata,
  toUsagePayload,
} from "@/lib/plan";

const isReplyRoute = createRouteMatcher(["/api/reply(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (!isReplyRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Please sign in to generate replies." }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const currentMetadata = (user.publicMetadata ?? {}) as Record<string, unknown>;
  const snapshot = buildPlanSnapshot(currentMetadata);

  if (snapshot.needsMetadataUpdate) {
    await client.users.updateUserMetadata(userId, {
      publicMetadata: buildUpdatedPublicMetadata(currentMetadata, snapshot),
    });
  }

  if (!snapshot.limitReached) {
    return NextResponse.next();
  }

  return NextResponse.json(
    {
      error: "Free plan limit reached for this month. Upgrade to Pro for unlimited replies.",
      usage: toUsagePayload(snapshot),
    },
    { status: 429 }
  );
});

export const config = {
  matcher: ["/api/reply(.*)"],
};
