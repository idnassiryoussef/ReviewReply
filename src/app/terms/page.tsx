import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

export const metadata = {
  title: "Terms of Service - ReviewReply",
  description: "Terms of service for using ReviewReply.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-base text-white/70">
            These terms are a placeholder for ReviewReply. When you’re ready, replace this
            content with your official terms.
          </p>

          <div className="mt-10 space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-lg shadow-black/10">
            <h2 className="text-xl font-semibold text-white">Overview</h2>
            <p className="text-sm text-white/70">
              ReviewReply is a micro-SaaS that helps businesses generate professional replies
              to Google reviews. This demo does not store personal data beyond local browser
              storage.
            </p>
            <h2 className="text-xl font-semibold text-white">Usage</h2>
            <p className="text-sm text-white/70">
              Use the tool at your own risk. Generated content is based on user input and an AI
              model. Review responses before posting.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
