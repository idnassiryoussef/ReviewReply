import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { AutoReplyStatsWidget } from "@/components/dashboard/AutoReplyStatsWidget";
import { ReviewInbox } from "@/components/dashboard/ReviewInbox";

export const metadata = {
  title: "Review Inbox - Dashboard",
  description: "AI-assisted review inbox to generate, edit, and approve customer review replies.",
};

export default function DashboardInboxPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main className="pt-10">
        <div className="mx-auto mb-6 max-w-7xl px-4 md:px-6">
          <AutoReplyStatsWidget />
        </div>
        <ReviewInbox />
      </main>
      <Footer />
    </div>
  );
}
