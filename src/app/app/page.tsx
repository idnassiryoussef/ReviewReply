import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ReviewForm } from "@/components/ReviewForm";

export const metadata = {
  title: "Review Reply Generator - App",
  description:
    "Generate professional Google review replies with a simple, fast UI. Reply to customers in seconds.",
};

export default function AppPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main>
        <div className="mx-auto max-w-6xl px-4 pt-10 md:px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Generate Google Review Replies
            </h1>
            <p className="mt-3 max-w-2xl text-base text-white/70">
              Paste a customer review and generate a professional reply instantly.
            </p>
          </div>
          <ReviewForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
