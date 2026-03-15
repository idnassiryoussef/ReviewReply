import { NextResponse } from "next/server";

/**
 * POST /api/checkout
 * Creates a Pro plan checkout session ($9/month) via Paddle.
 * Returns either a server-side checkout URL or the client-side
 * Paddle token + priceId for an overlay checkout.
 */
export async function POST() {
  const serverApiKey = process.env.PADDLE_API_KEY;
  const serverPriceId = process.env.PADDLE_PRICE_ID;

  // Preferred path: server-side Paddle transaction → redirect URL
  if (serverApiKey && serverPriceId) {
    try {
      const resp = await fetch("https://api.paddle.com/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serverApiKey}`,
        },
        body: JSON.stringify({
          items: [{ price_id: serverPriceId, quantity: 1 }],
        }),
      });

      if (!resp.ok) {
        const bodyText = await resp.text();
        return NextResponse.json(
          { error: bodyText || "Unable to create checkout session." },
          { status: resp.status }
        );
      }

      const data = (await resp.json()) as {
        data?: { checkout?: { url?: string } };
      };

      const checkoutUrl = data?.data?.checkout?.url;
      if (!checkoutUrl) {
        return NextResponse.json(
          { error: "Payment provider did not return a checkout URL." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        checkoutUrl,
        plan: "pro",
        price: "$9/month",
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Internal server error.";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  // Fallback: return client-side Paddle token for overlay checkout
  const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
  const clientPriceId = process.env.NEXT_PUBLIC_PADDLE_PRICE_ID;

  if (clientToken && clientPriceId) {
    return NextResponse.json({
      checkoutType: "client",
      token: clientToken,
      priceId: clientPriceId,
      environment: "production",
      plan: "pro",
      price: "$9/month",
    });
  }

  return NextResponse.json(
    {
      error:
        "Payment system is not configured. Add PADDLE_API_KEY and PADDLE_PRICE_ID to your environment.",
    },
    { status: 500 }
  );
}
