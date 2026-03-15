import { NextResponse } from "next/server";
import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import {
  buildPlanSnapshot,
  buildUpdatedPublicMetadata,
  toUsagePayload,
} from "@/lib/plan";

const isReplyRoute = createRouteMatcher(["/api/reply(.*)"]);
const isAppRoute = createRouteMatcher(["/app(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  if (isAppRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (!isReplyRoute(req)) {
    return NextResponse.next();
  }

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
  matcher: ["/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)", "/(api|trpc)(.*)"],
};
