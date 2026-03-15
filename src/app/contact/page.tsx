import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { ContactForm } from "@/components/ContactForm";

export const metadata = {
  title: "Contact - ReviewReply",
  description: "Get in touch with the ReviewReply team for questions or support.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-white">
      <Navbar />
      <main>
        <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Contact us
          </h1>
          <p className="mt-4 text-base text-white/70">
            Have a question or want to share feedback? Send us a message and we’ll get back to you.
          </p>

          <ContactForm />
        </div>
      </main>
      <Footer />
    </div>
  );
}
