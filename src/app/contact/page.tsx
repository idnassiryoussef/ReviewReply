import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

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

          <form
            action="mailto:idnassir93@gmail.com"
            method="post"
            encType="text/plain"
            className="mt-10 space-y-6 glass rounded-3xl p-8 shadow-lg"
          >
            <div>
              <label className="text-sm font-semibold text-white/80">Name</label>
              <input
                name="Name"
                type="text"
                placeholder="Your name"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Email</label>
              <input
                name="Email"
                type="email"
                placeholder="you@example.com"
                required
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-white/80">Message</label>
              <textarea
                name="Message"
                rows={6}
                placeholder="How can we help?"
                required
                className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-90"
            >
              Send message
            </button>

            <p className="text-sm text-white/60">
              This opens your email app and sends to idnassir93@gmail.com.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
