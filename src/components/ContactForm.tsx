"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        throw new Error(data.error || "Unable to send message right now.");
      }

      setSuccessMessage("Message sent successfully. We will get back to you soon.");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      const messageText = err instanceof Error ? err.message : "Unable to send message right now.";
      setErrorMessage(messageText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-6 glass rounded-3xl p-8 shadow-lg">
      <div>
        <label htmlFor="contact-name" className="text-sm font-semibold text-white/80">
          Name
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Your name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/35"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="text-sm font-semibold text-white/80">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/35"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-semibold text-white/80">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={6}
          placeholder="How can we help?"
          required
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className="mt-2 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-sm outline-none transition-all duration-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/35"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
            Sending...
          </>
        ) : (
          "Send message"
        )}
      </button>

      {successMessage ? <p className="text-sm text-emerald-300">{successMessage}</p> : null}
      {errorMessage ? <p className="text-sm text-rose-300">{errorMessage}</p> : null}
    </form>
  );
}
