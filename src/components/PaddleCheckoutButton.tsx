"use client";

import { useState } from "react";

declare global {
  interface Window {
    Paddle?: {
      Environment: {
        set: (environment: "sandbox" | "production") => void;
      };
      Initialize: (options: {
        token: string;
        eventCallback?: (event: { name?: string }) => void;
      }) => void;
      Checkout: {
        open: (options: {
          items: Array<{ priceId: string; quantity: number }>;
          settings?: {
            displayMode?: "overlay" | "inline";
            successUrl?: string;
          };
        }) => void;
      };
    };
  }
}

let paddleScriptPromise: Promise<void> | null = null;
let paddleInitialized = false;
const CHECKOUT_COMPLETED_KEY = "paddle_checkout_completed";

function loadPaddleScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Paddle can only be loaded in the browser."));
  }

  if (window.Paddle) {
    return Promise.resolve();
  }

  if (paddleScriptPromise) {
    return paddleScriptPromise;
  }

  paddleScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Paddle script."));
    document.head.appendChild(script);
  });

  return paddleScriptPromise;
}

type PaddleCheckoutButtonProps = {
  className: string;
  children: React.ReactNode;
};

type PaddleCheckoutConfig = {
  token: string;
  priceId: string;
  environment: "sandbox" | "production";
};

async function getPaddleCheckoutConfig(): Promise<PaddleCheckoutConfig> {
  const response = await fetch("/api/billing/paddle", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const data = (await response.json()) as { error?: string };
    throw new Error(
      data.error ||
        "Paddle is not configured. Missing NEXT_PUBLIC_PADDLE_CLIENT_TOKEN or NEXT_PUBLIC_PADDLE_PRICE_ID."
    );
  }

  return (await response.json()) as PaddleCheckoutConfig;
}

export function PaddleCheckoutButton({ className, children }: PaddleCheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    setLoading(true);

    try {
      const { token, priceId, environment } = await getPaddleCheckoutConfig();

      await loadPaddleScript();

      const paddle = window.Paddle;
      if (!paddle) {
        throw new Error("Paddle failed to initialize.");
      }

      if (!paddleInitialized) {
        paddle.Environment.set(environment);
        paddle.Initialize({
          token,
          eventCallback: (event) => {
            if (event?.name === "checkout.completed") {
              window.sessionStorage.setItem(CHECKOUT_COMPLETED_KEY, "1");
              return;
            }

            if (event?.name === "checkout.closed") {
              const checkoutCompleted =
                window.sessionStorage.getItem(CHECKOUT_COMPLETED_KEY) === "1";

              if (checkoutCompleted) {
                window.sessionStorage.removeItem(CHECKOUT_COMPLETED_KEY);
                return;
              }

              window.location.href = "/pricing";
            }
          },
        });
        paddleInitialized = true;
      }

      paddle.Checkout.open({
        items: [{ priceId, quantity: 1 }],
        settings: {
          displayMode: "overlay",
          successUrl: `${window.location.origin}/success`,
        },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unable to start checkout.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleCheckout}
        disabled={loading}
        className={className}
      >
        {loading ? "Opening checkout..." : children}
      </button>
      {error ? <p className="mt-2 text-xs text-rose-300">{error}</p> : null}
    </div>
  );
}
