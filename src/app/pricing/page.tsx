import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";

export const metadata = {
  title: "Pricing - ReviewReply",
  description:
    "Choose a plan that fits your business. Start free or upgrade for unlimited auto-replies and analytics.",
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main>
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}
