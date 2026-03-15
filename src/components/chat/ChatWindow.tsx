"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";

const SUGGESTIONS = [
  "Help me reply to a negative review",
  "Make this reply more professional",
  "Write a polite apology to a customer",
  "Improve this customer response",
  "Write a reply for a 5-star review",
  "How should I respond to a rude review?",
];

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-fuchsia-500 to-sky-500 text-xs font-bold text-white shadow">
        AI
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-4 py-3 shadow">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/60 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-white/60" />
        </div>
      </div>
    </div>
  );
}

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever messages change or loading state toggles
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(
    async (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || loading) return;

      setInput("");
      setError(null);

      const userMsg: Message = { id: generateId(), role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      // Build history for context (exclude the message just added)
      const history = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, history }),
        });

        const data = (await res.json().catch(() => null)) as
          | { reply?: string; error?: string }
          | null;

        if (!res.ok) {
          throw new Error(data?.error ?? "Something went wrong. Please try again.");
        }

        const aiMsg: Message = {
          id: generateId(),
          role: "assistant",
          content: data?.reply ?? "",
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again.";
        setError(message);
        // Remove the user message if the request failed so the user can retry
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setInput(content);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages]
  );

  const isEmpty = messages.length === 0;

  return (
    <div className="flex h-full flex-col">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5">
        {isEmpty && !loading ? (
          <div className="flex flex-col items-center justify-center gap-6 pt-8 text-center">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500/30 to-fuchsia-500/20 border border-white/10 shadow-lg">
              <span className="text-3xl">💬</span>
            </div>
            <div>
              <p className="text-base font-medium text-white">Start a conversation</p>
              <p className="mt-1 text-sm text-white/60">
                Ask about replies, tone, or how to handle any review.
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => sendMessage(s)}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white/80 transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {loading && <TypingIndicator />}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Error banner */}
      {error ? (
        <div className="mx-4 mb-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      ) : null}

      {/* Suggested prompts strip — visible after first message */}
      {!isEmpty && (
        <div className="px-4 mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {SUGGESTIONS.slice(0, 4).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => sendMessage(s)}
              disabled={loading}
              className="flex-shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-500/10 hover:text-white disabled:opacity-50"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-white/10 px-4 py-4">
        <ChatInput
          value={input}
          loading={loading}
          onChange={setInput}
          onSend={sendMessage}
        />
        <p className="mt-2 text-center text-xs text-white/30">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
