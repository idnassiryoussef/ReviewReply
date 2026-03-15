import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";

export const metadata = {
  title: "Pricing - ReviewReply",
  description:
    "Choose a plan that fits your business. Get free replies each month or upgrade for unlimited usage.",
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
