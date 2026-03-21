import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ActivityLog } from "@/components/dashboard/ActivityLog";
import { AutoReplyStatsWidget } from "@/components/dashboard/AutoReplyStatsWidget";
import { AutoReplyToggle } from "@/components/dashboard/AutoReplyToggle";
import { UsageBanner } from "@/components/dashboard/UsageBanner";

export const metadata = {
  title: "Auto Reply - Dashboard",
  description: "Configure automatic review replies, safety rules, and activity logs.",
};

export default function AutoReplyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-10 md:px-6">
        <UsageBanner />
        <AutoReplyStatsWidget />
        <AutoReplyToggle />
        <ActivityLog />
      </main>
      <Footer />
    </div>
  );
}
