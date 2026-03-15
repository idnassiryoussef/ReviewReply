# ReviewReply

A micro-SaaS web app that generates professional replies to Google reviews in seconds.

## Getting Started

1. Copy the example environment file and add your Anthropic key:

```bash
cp .env.local.example .env.local
# edit .env.local and set:
# ANTHROPIC_API_KEY=sk-ant-...
```

2. Install dependencies:

```bash
npm install
```

3. Run locally:

```bash
npm run dev
```

4. Open http://localhost:3000 in your browser.

## How it works

- Paste a Google review
- Choose a tone and business type
- Click **Generate Reply**
- Copy the suggested response and post it to Google Reviews

## Notes

- Free users get **10 replies per month** (tracked in Clerk public metadata).
- Set `CLAUDE_MODEL` in `.env.local` to change the model (defaults to `claude-haiku-4-5-20251001`).

## Deployment

Deploy on Vercel by connecting this repository and setting these environment variables in the Vercel dashboard:

- Required to generate replies:
	- `ANTHROPIC_API_KEY`
	- `CLERK_SECRET_KEY`
	- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Required for Paddle checkout:
	- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
	- `NEXT_PUBLIC_PADDLE_PRICE_ID`
	- `NEXT_PUBLIC_PADDLE_ENV`
- Optional (only if using backend Paddle transaction route):
	- `PADDLE_API_KEY`
	- `PADDLE_PRICE_ID`
	- `NEXT_PUBLIC_APP_URL`
- Optional app config:
	- `ADMIN_EMAILS`
	- `NEXT_PUBLIC_ADMIN_EMAILS`
	- `NEXT_PUBLIC_BUILT_BY_NAME`
	- `CLAUDE_MODEL`

This project includes a `vercel.json` config for build settings.

---

Built with Next.js, Tailwind CSS, and Anthropic Claude.

## Paddle Checkout Setup ($9/month)

1. In Paddle, create a **monthly subscription price** for `$9` and copy its `price_id` (example: `pri_xxx`).
2. In Paddle Developer Tools, create a **Client-side Token**.
3. Add these vars to `.env.local`:

```bash
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=pdl_ctm_your_client_token
NEXT_PUBLIC_PADDLE_PRICE_ID=pri_your_monthly_price_id
NEXT_PUBLIC_PADDLE_ENV=sandbox
```

4. Restart the dev server:

```bash
npm run dev
```

Behavior after setup:
- Clicking **Upgrade to Pro** opens Paddle Checkout.
- Successful payment redirects to `/success`.
- Closing/canceling checkout redirects to `/pricing`.

### Optional Backend Route

This project also includes a backend route template at:

- `src/app/api/billing/paddle/route.ts`

If you want to create transactions server-side, configure:

```bash
PADDLE_API_KEY=pdl_live_or_sdbx_api_key
PADDLE_PRICE_ID=pri_your_monthly_price_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
