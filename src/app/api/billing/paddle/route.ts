import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.PADDLE_API_KEY;
  const priceId = process.env.PADDLE_PRICE_ID;

  if (!apiKey || !priceId) {
    return NextResponse.json(
      { error: "Missing PADDLE_API_KEY or PADDLE_PRICE_ID." },
      { status: 500 }
    );
  }

  try {
    const resp = await fetch("https://api.paddle.com/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        items: [{ price_id: priceId, quantity: 1 }],
      }),
    });

    if (!resp.ok) {
      const bodyText = await resp.text();
      return NextResponse.json(
        { error: bodyText || "Unable to create Paddle transaction." },
        { status: resp.status }
      );
    }

    const data = (await resp.json()) as {
      data?: { checkout?: { url?: string } };
    };

    const checkoutUrl = data?.data?.checkout?.url;
    if (!checkoutUrl) {
      return NextResponse.json(
        { error: "Paddle did not return a checkout URL." },
        { status: 500 }
      );
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
