import { FAQSection } from "@/components/FAQSection";
import { FeaturesGrid } from "@/components/FeaturesGrid";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";
import { PricingSection } from "@/components/PricingSection";
import { DemoGenerator } from "@/components/DemoGenerator";
import { SocialProof } from "@/components/SocialProof";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { WhySection } from "@/components/WhySection";

export const metadata = {
  title: "Google Review Reply Generator",
  description:
    "Generate professional replies to Google reviews in seconds. Perfect for restaurants, cafes, hotels and local businesses.",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main>
        <HeroSection />
        <SocialProof />
        <WhySection />
        <HowItWorks />
        <FeaturesGrid />
        <DemoGenerator />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
