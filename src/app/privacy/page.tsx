import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Privacy Policy - ReviewReply",
  description: "Privacy policy placeholder for ReviewReply.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base text-white/70">
            This placeholder privacy policy explains how ReviewReply handles data.
          </p>

          <div className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/10">
            <h2 className="text-xl font-semibold text-white">What we collect</h2>
            <p className="text-sm text-white/70">
              ReviewReply does not store personal data on the server. We use local browser
              storage to track usage limits.
            </p>
            <h2 className="text-xl font-semibold text-white">Third-party services</h2>
            <p className="text-sm text-white/70">
              The app uses an AI provider (OpenAI or Anthropic). Data sent to the AI model is the
              review text you provide.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
