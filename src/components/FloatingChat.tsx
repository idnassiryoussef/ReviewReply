"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

// ─── Types ────────────────────────────────────────────────────────────────────

type Role = "user" | "assistant";

interface Message {
  id: string;
  role: Role;
  content: string;
}

interface ChatUsagePayload {
  plan: "free" | "pro";
  month: string;
  usedThisMonth: number;
  monthlyLimit: number | null;
  remaining: number | null;
  limitReached: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FREE_LIMIT = 3;
const STORAGE_KEY = "fc_guest_replies_used";
const MAX_MESSAGE_LENGTH = 1000;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function readCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(STORAGE_KEY);
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function writeCount(n: number) {
  localStorage.setItem(STORAGE_KEY, String(n));
}

function sanitizeInput(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r\n?/g, "\n")
    .trim();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-1.5 px-4 py-3">
      {["-0.3s", "-0.15s", "0s"].map((d) => (
        <span
          key={d}
          className="h-2 w-2 animate-bounce rounded-full bg-white/50"
          style={{ animationDelay: d }}
        />
      ))}
    </div>
  );
}

interface BubbleProps {
  msg: Message;
}

function Bubble({ msg }: BubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = msg.role === "user";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // silent
    }
  };

  return (
    <div className={`flex gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
        style={{
          background: isUser
            ? "linear-gradient(135deg,#a855f7,#6366f1)"
            : "linear-gradient(135deg,#6366f1,#0ea5e9)",
        }}
      >
        {isUser ? "You" : "AI"}
      </div>

      <div className={`group flex max-w-[82%] flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className="rounded-2xl px-3 py-2 text-sm leading-relaxed text-white"
          style={{
            background: isUser
              ? "linear-gradient(135deg,rgba(168,85,247,0.45),rgba(99,102,241,0.35))"
              : "#1e2a3a",
            border: isUser
              ? "1px solid rgba(168,85,247,0.35)"
              : "1px solid rgba(255,255,255,0.08)",
            borderRadius: isUser ? "16px 4px 16px 16px" : "4px 16px 16px 16px",
          }}
        >
          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        </div>

        {!isUser && (
          <button
            type="button"
            onClick={copy}
            className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/40 opacity-0 transition-all group-hover:opacity-100 hover:text-white/80"
          >
            <ClipboardDocumentCheckIcon className="h-3 w-3" />
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function FloatingChat() {
  const { isSignedIn, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usedCount, setUsedCount] = useState(0);
  const [usage, setUsage] = useState<ChatUsagePayload | null>(null);
  const [assistantLimitReached, setAssistantLimitReached] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Read persisted count once on mount
  useEffect(() => {
    setUsedCount(readCount());
  }, []);

  // Auto-scroll on new content
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus input when opening
  useEffect(() => {
    if (open) {
      setTimeout(() => textareaRef.current?.focus(), 50);
    }
  }, [open]);

  const guestRemaining = FREE_LIMIT - usedCount;
  const remaining = isSignedIn ? usage?.remaining : guestRemaining;
  const guestLocked = !isSignedIn && isLoaded && usedCount >= FREE_LIMIT;
  const locked = guestLocked || assistantLimitReached;

  const send = useCallback(
    async (text?: string) => {
      const content = sanitizeInput(text ?? input);
      if (loading || locked) return;

      if (!content) {
        setError("Please enter a message before sending.");
        return;
      }

      if (content.length > MAX_MESSAGE_LENGTH) {
        setError("Message is too long. Keep it under 1000 characters.");
        return;
      }

      setInput("");
      setError(null);

      const userMsg: Message = { id: uid(), role: "user", content };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      const history = messages.map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, history }),
        });

        const data = (await res.json().catch(() => null)) as
          | { reply?: string; error?: string; usage?: ChatUsagePayload | null }
          | null;

        if (data?.usage) {
          setUsage(data.usage);
          setAssistantLimitReached(Boolean(data.usage.limitReached));
        }

        if (!res.ok) {
          throw new Error(data?.error ?? "Something went wrong. Please try again.");
        }

        const aiMsg: Message = { id: uid(), role: "assistant", content: data?.reply ?? "" };
        setMessages((prev) => [...prev, aiMsg]);

        // Increment guest counter only after success
        if (!isSignedIn) {
          const next = usedCount + 1;
          setUsedCount(next);
          writeCount(next);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Something went wrong.";
        setError(msg);
        setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
        setInput(content);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, locked, messages, isSignedIn, usedCount]
  );

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
    }
  };

  const isEmpty = messages.length === 0;
  const SUGGESTIONS = [
    "Help me reply to a negative review",
    "Make this reply more professional",
    "Write a polite apology to a customer",
    "Improve this customer response",
  ];

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    void send(suggestion);
  };

  return (
    <>
      {/* ── Floating toggle button ── */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-2xl transition-all duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "linear-gradient(135deg,#a855f7,#6366f1)",
          boxShadow: "0 0 28px rgba(139,92,246,0.45)",
        }}
      >
        {open ? (
          <XMarkIcon className="h-5 w-5" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-5 w-5" />
        )}
        {open ? "Close" : "Ask AI"}
      </button>

      {/* ── Chat window ── */}
      {open && (
        <div
          className="fixed bottom-20 right-6 z-50 flex flex-col overflow-hidden"
          style={{
            width: "min(380px, calc(100vw - 24px))",
            height: "min(520px, calc(100dvh - 110px))",
            background: "#131a27",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "16px",
            boxShadow: "0 0 40px rgba(139,92,246,0.2), 0 20px 60px rgba(0,0,0,0.6)",
          }}
        >
          {/* Header */}
          <div
            className="flex flex-shrink-0 items-center gap-3 px-4 py-3"
            style={{
              background: "linear-gradient(135deg,#1e1040,#1a1a3a)",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
              style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
            >
              AI
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-white">ReviewReply Assistant</p>
              <p className="text-xs text-white/50">Ask about reviews &amp; replies</p>
            </div>
            {/* Badge */}
            {!isSignedIn && isLoaded && (
              <span
                className="flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                style={{ background: "rgba(168,85,247,0.25)", border: "1px solid rgba(168,85,247,0.4)" }}
              >
                {remaining == null ? "Pro" : remaining <= 0 ? "0 free" : `${remaining} free`}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-3 px-3 py-4">
            {isEmpty && !loading && (
              <div className="space-y-3">
                <p className="text-center text-xs text-white/40">
                  {isSignedIn
                    ? usage?.plan === "free"
                      ? `${Math.max(usage.remaining ?? 0, 0)} free assistant messages left this month`
                      : "Pro plan: unlimited AI assistance"
                    : `${FREE_LIMIT - usedCount} free ${FREE_LIMIT - usedCount === 1 ? "reply" : "replies"} remaining`}
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSuggestion(s)}
                      disabled={locked}
                      className="rounded-xl px-3 py-2 text-left text-xs text-white/70 transition-all hover:text-white disabled:opacity-40"
                      style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.07)" }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => (
              <Bubble key={msg.id} msg={msg} />
            ))}

            {loading && (
              <div className="flex gap-2">
                <div
                  className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg,#6366f1,#0ea5e9)" }}
                >
                  AI
                </div>
                <div
                  className="rounded-2xl"
                  style={{ background: "#1e2a3a", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <p className="rounded-xl px-3 py-2 text-xs text-rose-300"
                style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Lock banner */}
          {locked ? (
            <div
              className="flex-shrink-0 flex flex-col items-center gap-3 px-4 py-5 text-center"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0d1117" }}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-xl"
                style={{ background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.3)" }}
              >
                🔒
              </div>
              <p className="text-sm font-medium text-white">You&apos;ve used your 3 free replies</p>
              <p className="text-xs text-white/55">
                {assistantLimitReached
                  ? "You reached your free assistant limit. Upgrade to Pro for unlimited AI assistance."
                  : "Sign in to keep chatting — it&apos;s free."}
              </p>
              <Link
                href={assistantLimitReached ? "/pricing" : "/sign-in"}
                className="rounded-full px-5 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
              >
                {assistantLimitReached ? "Upgrade to Pro →" : "Sign in to continue →"}
              </Link>
            </div>
          ) : (
            /* Input area */
            <div
              className="flex-shrink-0 flex items-end gap-2 px-3 py-3"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0d1117" }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextChange}
                onKeyDown={handleKey}
                placeholder="Ask about reviews…"
                rows={1}
                maxLength={MAX_MESSAGE_LENGTH}
                disabled={loading}
                className="flex-1 resize-none rounded-xl px-3 py-2 text-sm text-white placeholder-white/30 outline-none transition-all disabled:opacity-60"
                style={{
                  background: "#0d1117",
                  border: "1px solid rgba(255,255,255,0.1)",
                  minHeight: "40px",
                  maxHeight: "120px",
                  caretColor: "#a855f7",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(168,85,247,0.6)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={!input.trim() || loading}
                aria-label="Send"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
                style={{ background: "linear-gradient(135deg,#a855f7,#6366f1)" }}
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <PaperAirplaneIcon className="h-4 w-4" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
