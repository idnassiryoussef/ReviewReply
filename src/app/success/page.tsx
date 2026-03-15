import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Payment Successful - ReviewReply",
  description: "Your Pro subscription is now active.",
};

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <section className="glass mx-auto max-w-2xl rounded-3xl p-8 text-center shadow-lg">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Payment successful
          </h1>
          <p className="mt-4 text-white/75">
            Welcome to Pro. Your subscription is active and you can continue
            generating replies.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              Go to App
            </Link>
            <Link
              href="/pricing"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              View Pricing
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
